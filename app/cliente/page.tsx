import Link from "next/link";

import { requireAuth } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/data";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";

export default async function CustomerPage() {
  const user = await requireAuth();
  const orders = await getCustomerOrders(user.id);

  return (
    <div className="grid">
      <section className="hero-card">
        <div className="eyebrow">Minha area</div>
        <h1>Historico de pedidos</h1>
        <p>Consulte compras anteriores, acompanhe pagamentos e abra o resumo imprimivel de cada pedido.</p>
      </section>

      <section className="card">
        <div className="section-title">
          <h2>Meus pedidos</h2>
          <Link href="/" className="pill-link pill-link--solid">
            Fazer novo pedido
          </Link>
        </div>
        {orders.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Resumo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <span className={`badge ${order.status}`}>{getStatusLabel(order.status)}</span>
                    </td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>
                      <Link href={`/pedido/${order.id}`} className="pill-link">
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">Voce ainda nao realizou pedidos.</div>
        )}
      </section>
    </div>
  );
}
