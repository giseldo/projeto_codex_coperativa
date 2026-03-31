import Link from "next/link";

import { OrderStatusForm } from "@/components/order-status-form";
import { requireRole } from "@/lib/auth";
import { getAdminOrders } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";

export default async function AdminOrdersPage() {
  await requireRole("admin");
  const orders = await getAdminOrders();
  const supabase = await createClient();

  const ordersWithProofs = orders.map((order) => {
    if (!order.payment_proof_path) return order;
    const { data } = supabase.storage.from("payment-proofs").getPublicUrl(order.payment_proof_path);
    return {
      ...order,
      payment_proof_url: data.publicUrl
    };
  });

  return (
    <div className="grid">
      <div className="button-row">
        <Link href="/admin" className="pill-link">
          Voltar ao painel
        </Link>
      </div>

      <section className="card">
        <div className="section-title">
          <div>
            <h2>Pedidos recebidos</h2>
            <p className="muted">Valide pagamento, abra comprovantes e imprima resumos individuais.</p>
          </div>
        </div>
        <div className="grid">
          {ordersWithProofs.map((order) => (
            <article key={order.id} className="card">
              <div className="section-title">
                <div>
                  <div className="eyebrow">Pedido #{order.id.slice(0, 8)}</div>
                  <h3>{order.customer_name}</h3>
                  <p className="muted">{order.customer_email}</p>
                </div>
                <span className={`badge ${order.status}`}>{getStatusLabel(order.status)}</span>
              </div>

              <div className="grid" style={{ gap: 10 }}>
                <span className="muted">Criado em {formatDate(order.created_at)}</span>
                <strong>{formatCurrency(order.total_amount)}</strong>
              </div>

              <OrderStatusForm orderId={order.id} status={order.status} />

              <div className="inline-actions">
                <Link href={`/pedido/${order.id}`} className="pill-link">
                  Abrir resumo
                </Link>
                {order.payment_proof_url ? (
                  <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className="pill-link pill-link--solid">
                    Ver comprovante
                  </a>
                ) : (
                  <span className="pill-link">Sem comprovante</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
