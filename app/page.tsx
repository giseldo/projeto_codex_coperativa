import Link from "next/link";

import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { getActiveProducts } from "@/lib/data";
import { Product } from "@/lib/types";

function groupProductsByCategory(products: Product[]) {
  const grouped = new Map<string, Product[]>();

  for (const product of products) {
    const category = product.category || "Outros";
    const current = grouped.get(category) || [];
    current.push(product);
    grouped.set(category, current);
  }

  return Array.from(grouped.entries());
}

export default async function HomePage() {
  const products = await getActiveProducts();
  const groupedProducts = groupProductsByCategory(products);

  return (
    <div className="grid">
      <Hero />

      <section className="grid">
        <div className="section-title">
          <div>
            <div className="eyebrow">Catálogo da semana</div>
            <h2>Produtos disponíveis</h2>
          </div>
          <Link href="/checkout" className="pill-link pill-link--solid">
            Ver cesta
          </Link>
        </div>

        {groupedProducts.length ? (
          <div className="grid grouped-catalog">
            {groupedProducts.map(([category, items]) => (
              <section key={category} className="grid category-section">
                <div className="category-heading">
                  <div>
                    <div className="eyebrow">Seção do catálogo</div>
                    <h3>{category}</h3>
                  </div>
                  <span className="badge">{items.length} item(ns)</span>
                </div>
                <div className="grid grid-products">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="card empty-state">
            Nenhum produto cadastrado no momento. Use o painel administrativo para publicar a primeira cesta.
          </div>
        )}
      </section>
    </div>
  );
}
