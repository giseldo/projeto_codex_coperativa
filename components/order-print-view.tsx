import { Order } from "@/lib/types";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";

export function OrderPrintView({ order }: { order: Order }) {
  return (
    <div className="grid print-shell">
      <section className="card">
        <div className="section-title">
          <div>
            <div className="eyebrow">Resumo do pedido</div>
            <h1>Pedido #{order.id.slice(0, 8)}</h1>
          </div>
          <span className={`badge ${order.status}`}>{getStatusLabel(order.status)}</span>
        </div>
        <p className="muted">
          Criado em {formatDate(order.created_at)} por {order.customer_name}
        </p>
      </section>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preco unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.product_name}</strong>
                    <div className="muted">{item.unit}</div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{formatCurrency(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>Total</h3>
          <div className="price">{formatCurrency(order.total_amount)}</div>
        </div>
        {order.notes ? <p className="muted">Observacoes: {order.notes}</p> : null}
      </section>
    </div>
  );
}
