import Link from "next/link";

import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { getActiveProducts } from "@/lib/data";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <div className="grid">
      <Hero />

      <section className="grid">
        <div className="section-title">
          <div>
            <div className="eyebrow">Catalogo da semana</div>
            <h2>Produtos disponiveis</h2>
          </div>
          <Link href="/checkout" className="pill-link pill-link--solid">
            Ver cesta
          </Link>
        </div>

        {products.length ? (
          <div className="grid grid-products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
