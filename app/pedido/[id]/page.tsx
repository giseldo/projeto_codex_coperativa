import { notFound } from "next/navigation";

import { OrderPrintView } from "@/components/order-print-view";
import { PrintButton } from "@/components/print-button";
import { getCurrentProfile } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function OrderPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const order = await getOrderById(id);

  if (!order || !profile) notFound();
  if (profile.role !== "admin" && order.user_id !== profile.id) notFound();

  if (order.payment_proof_path) {
    const supabase = await createClient();
    const { data } = supabase.storage.from("payment-proofs").getPublicUrl(order.payment_proof_path);
    order.payment_proof_url = data.publicUrl;
  }

  return (
    <div className="grid">
      <div className="no-print button-row">
        <PrintButton label="Imprimir pedido" />
      </div>
      <OrderPrintView order={order} />
      {order.payment_proof_url ? (
        <section className="card no-print">
          <div className="section-title">
            <h3>Comprovante enviado</h3>
          </div>
          <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className="pill-link pill-link--solid">
            Abrir comprovante
          </a>
        </section>
      ) : null}
    </div>
  );
}
