"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useCart } from "@/components/cart-provider";
import { PrintButton } from "@/components/print-button";
import { createOrderAction } from "@/lib/actions";
import { Profile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [notes, setNotes] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError("");
    if (!items.length) {
      setError("Adicione produtos à cesta antes de finalizar.");
      return;
    }

    formData.set("items", JSON.stringify(items));
    formData.set("notes", notes);
    formData.set("customerName", profile.full_name ?? "");
    if (paymentProof) {
      formData.set("paymentProof", paymentProof);
    }

    startTransition(async () => {
      const result = await createOrderAction(formData);
      if (!result.success || !result.orderId) {
        setError(result.message ?? "Não foi possível concluir o pedido.");
        return;
      }

      clearCart();
      router.push(`/pedido/${result.orderId}`);
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="card form-grid">
      <div className="section-title">
        <div>
          <h2>Finalizar pedido</h2>
          <p className="muted">Revise os dados e envie o comprovante, se já tiver efetuado o pagamento.</p>
        </div>
        <div className="badge">Total {formatCurrency(total)}</div>
      </div>

      <div className="field">
        <label htmlFor="notes">Observações</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Ex.: substituir em caso de indisponibilidade, observações para entrega..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="paymentProof">Comprovante de pagamento (opcional no checkout)</label>
        <input
          id="paymentProof"
          name="paymentProof"
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.webp"
          onChange={(event) => setPaymentProof(event.target.files?.[0] ?? null)}
        />
      </div>

      {error ? <div className="badge cancelled">{error}</div> : null}

      <div className="button-row">
        <button className="button-primary" type="submit" disabled={isPending}>
          {isPending ? "Processando..." : "Confirmar pedido"}
        </button>
        <PrintButton label="Imprimir resumo" />
      </div>
    </form>
  );
}
