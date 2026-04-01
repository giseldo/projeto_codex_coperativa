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

      <div className="admin-products-layout">
        <AdminProductForm />

        <section className="card admin-product-list-card">
          <div className="section-title">
            <div>
              <h2>Produtos cadastrados</h2>
              <p className="muted">Edite valores, descrição, disponibilidade e a foto do catálogo.</p>
            </div>
          </div>

          <div className="grid admin-product-list">
            {products.map((product) => (
              <article key={product.id} className="card admin-product-row">
                <div className="admin-product-row__media">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="admin-product-row__img" />
                  ) : (
                    <div className="admin-product-row__placeholder">Sem foto</div>
                  )}
                </div>
                <div className="admin-product-row__content">
                  <div className="section-title">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="muted">{product.description || "Sem descrição"}</p>
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
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
