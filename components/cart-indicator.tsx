"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartIndicator() {
  const { totalItems, total } = useCart();

  return (
    <Link href="/checkout" className="pill-link">
      Cesta {totalItems > 0 ? `(${totalItems})` : ""} {totalItems > 0 ? `• ${formatCurrency(total)}` : ""}
    </Link>
  );
}
