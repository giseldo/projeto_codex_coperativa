"use client";

import { useTransition } from "react";

import { updateOrderStatusAction } from "@/lib/actions";
import { OrderStatus } from "@/lib/types";

export function OrderStatusForm({
  orderId,
  status
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <label className="field">
      <span>Status do pedido</span>
      <select
        defaultValue={status}
        onChange={(event) =>
          startTransition(async () => {
            await updateOrderStatusAction(orderId, event.target.value as OrderStatus);
          })
        }
        disabled={isPending}
      >
        <option value="pending">Pendente</option>
        <option value="paid">Pago</option>
        <option value="cancelled">Cancelado</option>
      </select>
    </label>
  );
}
