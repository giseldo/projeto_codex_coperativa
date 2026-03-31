"use client";

import { useTransition } from "react";

import { deleteProductAction } from "@/lib/actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="button-danger"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProductAction(id);
        })
      }
    >
      {isPending ? "Removendo..." : "Remover"}
    </button>
  );
}
