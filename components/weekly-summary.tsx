import { WeeklyProductSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function WeeklySummary({
  summary,
  totalRevenue
}: {
  summary: WeeklyProductSummary[];
  totalRevenue: number;
}) {
  return (
    <div className="grid">
      <div className="stats">
        <article className="card stat-card">
          <span className="eyebrow">Arrecadação</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
          <span className="muted">Total da janela selecionada</span>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Itens consolidados</span>
          <strong>{summary.length}</strong>
          <span className="muted">Produtos diferentes no relatório</span>
        </article>
      </div>

      <section className="card">
        <div className="section-title">
          <div>
            <h3>Somatório por produto</h3>
            <p className="muted">Use este resumo para organizar separação, entrega e repasse.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade total</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item) => (
                <tr key={`${item.product_name}-${item.unit}`}>
                  <td>
                    <strong>{item.product_name}</strong>
                    <div className="muted">{item.unit}</div>
                  </td>
                  <td>
                    {item.total_quantity} {item.unit}
                  </td>
                  <td>{formatCurrency(item.total_revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
