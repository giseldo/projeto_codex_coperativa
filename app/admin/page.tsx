import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { getAdminOrders, getAdminProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  await requireRole("admin");
  const [orders, products] = await Promise.all([getAdminOrders(), getAdminProducts()]);
  const paidOrders = orders.filter((order) => order.status === "paid").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="grid">
      <section className="hero-card">
        <div className="eyebrow">Painel administrativo</div>
        <h1>Gestão completa da cesta semanal.</h1>
        <p>Controle produtos, pagamentos, comprovantes e relatórios em uma única operação.</p>
      </section>

      <section className="stats">
        <article className="card stat-card">
          <span className="eyebrow">Produtos ativos</span>
          <strong>{products.filter((item) => item.active).length}</strong>
          <span className="muted">Itens prontos para venda</span>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Pedidos pendentes</span>
          <strong>{pendingOrders}</strong>
          <span className="muted">Aguardando validação de pagamento</span>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Pedidos pagos</span>
          <strong>{paidOrders}</strong>
          <span className="muted">Já confirmados pela administração</span>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Receita total</span>
          <strong>{formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}</strong>
          <span className="muted">Somatório histórico</span>
        </article>
      </section>

      <div className="button-row">
        <Link href="/admin/produtos" className="pill-link pill-link--solid">
          Gerenciar produtos
        </Link>
        <Link href="/admin/pedidos" className="pill-link">
          Visualizar pedidos
        </Link>
        <Link href="/admin/relatorios" className="pill-link">
          Relatórios semanais
        </Link>
      </div>
    </div>
  );
}
