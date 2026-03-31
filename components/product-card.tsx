"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState("");

  function handleAdd() {
    addItem(product);
    setFeedback("Adicionado a cesta");
    window.setTimeout(() => setFeedback(""), 1400);
  }

  return (
    <article className="card product-card">
      <div>
        <div className="eyebrow">Producao local</div>
        <h3>{product.name}</h3>
        <p className="muted">{product.description || "Produto fresco da agricultura familiar de Vicosa/AL."}</p>
      </div>
      <div>
        <div className="price">{formatCurrency(product.price)}</div>
        <div className="muted">por {product.unit}</div>
      </div>
      <div className="button-row">
        <button type="button" className="button-primary" onClick={handleAdd}>
          Adicionar
        </button>
        {feedback ? <span className="badge">{feedback}</span> : null}
      </div>
    </article>
  );
}
