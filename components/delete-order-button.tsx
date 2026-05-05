"use client";

import { useTransition } from "react";

import { deleteOrderAction } from "@/lib/actions";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      const result = await deleteOrderAction(orderId);
      if (!result.success) alert(result.message);
    });
  }

  return (
    <button
      type="button"
      className="button button-danger"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
