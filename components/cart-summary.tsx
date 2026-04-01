"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartSummary() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="card empty-state">
        <p>Sua cesta ainda está vazia.</p>
        <Link href="/" className="pill-link pill-link--solid">
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>Cesta de compras</h2>
          <p className="muted">Ajuste as quantidades antes de concluir o pedido.</p>
        </div>
        <button type="button" className="button-secondary no-print" onClick={clearCart}>
          Limpar cesta
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th className="no-print">Ação</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td>
                  <strong>{item.name}</strong>
                  <div className="muted">por {item.unit}</div>
                </td>
                <td>{formatCurrency(item.price)}</td>
                <td style={{ minWidth: 150 }}>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                  />
                </td>
                <td>{formatCurrency(item.price * item.quantity)}</td>
                <td className="no-print">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title" style={{ marginTop: 18 }}>
        <h3>Total do pedido</h3>
        <div className="price">{formatCurrency(total)}</div>
      </div>
    </div>
  );
}
