import Link from "next/link";

import { AdminProductForm } from "@/components/admin-product-form";
import { DeleteProductButton } from "@/components/delete-product-button";
import { requireRole } from "@/lib/auth";
import { getAdminProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  await requireRole("admin");
  const products = await getAdminProducts();

  return (
    <div className="grid">
      <div className="button-row">
        <Link href="/admin" className="pill-link">
          Voltar ao painel
        </Link>
      </div>

      <div className="two-columns">
        <AdminProductForm />

        <section className="card">
          <div className="section-title">
            <div>
              <h2>Produtos cadastrados</h2>
              <p className="muted">Edite valores, descricao e disponibilidade.</p>
            </div>
          </div>

          <div className="grid">
            {products.map((product) => (
              <article key={product.id} className="card">
                <div className="section-title">
                  <div>
                    <h3>{product.name}</h3>
                    <p className="muted">{product.description || "Sem descricao"}</p>
                  </div>
                  <span className={`badge ${product.active ? "" : "cancelled"}`}>
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p>
                  <strong>{formatCurrency(product.price)}</strong> por {product.unit}
                </p>
                <div className="inline-actions">
                  <Link href={`/admin/produtos/${product.id}`} className="pill-link">
                    Editar
                  </Link>
                  <DeleteProductButton id={product.id} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
