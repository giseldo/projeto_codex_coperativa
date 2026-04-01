"use server";

import { revalidatePath } from "next/cache";

import { requireAuth, requireRole } from "@/lib/auth";
import { getWeeklyReport } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { CartItem, OrderStatus, WeeklyProductSummary } from "@/lib/types";
import { slugifyFilename, toCsv } from "@/lib/utils";

type ActionState = {
  success: boolean;
  message: string;
};

function parseItems(rawItems: string) {
  return JSON.parse(rawItems) as CartItem[];
}

async function uploadProductImage(supabase: Awaited<ReturnType<typeof createClient>>, productId: string, imageFile: File) {
  const extension = imageFile.name.split(".").pop() || "bin";
  const baseName = imageFile.name.replace(/\.[^.]+$/, "") || productId;
  const path = `products/${productId}-${slugifyFilename(baseName)}.${extension}`;
  const arrayBuffer = await imageFile.arrayBuffer();

  const { error } = await supabase.storage.from("product-images").upload(path, arrayBuffer, {
    contentType: imageFile.type,
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function saveProductAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("admin");
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const imageFile = formData.get("productImage");
  const payload = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "") || null,
    category: String(formData.get("category") || "") || null,
    price: Number(formData.get("price") || 0),
    unit: String(formData.get("unit") || ""),
    active: String(formData.get("active") || "true") === "true"
  };

  const query = id
    ? supabase.from("products").update(payload).eq("id", id).select("id, image_path").single()
    : supabase.from("products").insert(payload).select("id, image_path").single();

  const { data, error } = await query;

  if (error || !data) {
    return { success: false, message: error?.message || "Nao foi possivel salvar o produto." };
  }

  try {
    if (imageFile instanceof File && imageFile.size > 0) {
      const imagePath = await uploadProductImage(supabase, data.id, imageFile);
      await supabase.from("products").update({ image_path: imagePath }).eq("id", data.id);
    }
  } catch (imageError) {
    return {
      success: false,
      message: imageError instanceof Error ? imageError.message : "Falha ao enviar a imagem do produto."
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  return {
    success: true,
    message: id ? "Produto atualizado com sucesso." : "Produto criado com sucesso."
  };
}

export async function deleteProductAction(id: string) {
  await requireRole("admin");
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("image_path").eq("id", id).single();
  if (data?.image_path) {
    await supabase.storage.from("product-images").remove([data.image_path]);
  }
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/produtos");
}

export async function createOrderAction(formData: FormData) {
  const user = await requireAuth();
  const supabase = await createClient();

  const rawItems = String(formData.get("items") || "[]");
  const items = parseItems(rawItems).filter((item) => item.quantity > 0);
  if (!items.length) {
    return { success: false, message: "Nenhum item informado no pedido." };
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const customerName = String(formData.get("customerName") || user.user_metadata.full_name || "Cliente");
  const notes = String(formData.get("notes") || "") || null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: customerName,
      customer_email: user.email ?? "",
      notes,
      total_amount: totalAmount,
      status: "pending"
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, message: orderError?.message || "Nao foi possivel criar o pedido." };
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    unit: item.unit,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return { success: false, message: itemsError.message };
  }

  const paymentProof = formData.get("paymentProof");
  if (paymentProof instanceof File && paymentProof.size > 0) {
    const extension = paymentProof.name.split(".").pop() || "bin";
    const baseName = paymentProof.name.replace(/\.[^.]+$/, "");
    const path = `${user.id}/${order.id}-${slugifyFilename(baseName)}.${extension}`;
    const arrayBuffer = await paymentProof.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, arrayBuffer, {
        contentType: paymentProof.type,
        upsert: true
      });

    if (!uploadError) {
      await supabase.from("orders").update({ payment_proof_path: path }).eq("id", order.id);
    }
  }

  revalidatePath("/cliente");
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");

  return { success: true, orderId: order.id };
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/pedido/${orderId}`);
}

export async function exportWeeklyReportAction(startDate: string, endDate: string) {
  await requireRole("admin");
  const report = await getWeeklyReport(startDate, endDate);
  const rows: Record<string, string | number>[] = report.summary.map((item: WeeklyProductSummary) => ({
    produto: item.product_name,
    unidade: item.unit,
    quantidade_total: item.total_quantity,
    receita_total: item.total_revenue
  }));

  rows.push({
    produto: "TOTAL",
    unidade: "",
    quantidade_total: "",
    receita_total: report.totalRevenue
  });

  return {
    success: true,
    csv: toCsv(rows)
  };
}
