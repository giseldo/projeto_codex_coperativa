import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { requireRole } from "@/lib/auth";
import { getAdminOrders } from "@/lib/data";
import { formatDate, formatCurrency, getStatusLabel } from "@/lib/utils";

export async function GET() {
  await requireRole("admin");

  const orders = await getAdminOrders();

  const pedidosRows = orders.map((o) => ({
    "ID do Pedido": o.id,
    Cliente: o.customer_name,
    Email: o.customer_email,
    Status: getStatusLabel(o.status),
    "Total (R$)": o.total_amount,
    "Total Formatado": formatCurrency(o.total_amount),
    "Data do Pedido": formatDate(o.created_at),
    Observações: o.notes ?? "",
  }));

  const itensRows = orders.flatMap((o) =>
    (o.order_items ?? []).map((item) => ({
      "ID do Pedido": o.id,
      Cliente: o.customer_name,
      Produto: item.product_name,
      Unidade: item.unit,
      Quantidade: item.quantity,
      "Preço Unitário (R$)": item.unit_price,
      "Subtotal (R$)": item.line_total,
    }))
  );

  const wb = XLSX.utils.book_new();

  const wsPedidos = XLSX.utils.json_to_sheet(pedidosRows);
  XLSX.utils.book_append_sheet(wb, wsPedidos, "Pedidos");

  const wsItens = XLSX.utils.json_to_sheet(itensRows);
  XLSX.utils.book_append_sheet(wb, wsItens, "Itens dos Pedidos");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="pedidos-${date}.xlsx"`,
    },
  });
}
