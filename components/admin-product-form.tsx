"use client";

import { useActionState, useEffect } from "react";

import { saveProductAction } from "@/lib/actions";
import { Product } from "@/lib/types";

const initialState = { success: false, message: "" };

export function AdminProductForm({ product }: { product?: Product | null }) {
  const [state, action, isPending] = useActionState(saveProductAction, initialState);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("product-form") as HTMLFormElement | null;
      if (form && !product) form.reset();
    }
  }, [product, state.success]);

  return (
    <form id="product-form" action={action} className="card form-grid">
      <div className="section-title">
        <div>
          <h3>{product ? "Editar produto" : "Novo produto"}</h3>
          <p className="muted">Cadastre itens disponiveis para a cesta semanal.</p>
        </div>
      </div>

      <input type="hidden" name="id" defaultValue={product?.id ?? ""} />

      <div className="field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" required defaultValue={product?.name ?? ""} />
      </div>

      <div className="form-grid two">
        <div className="field">
          <label htmlFor="price">Preco</label>
          <input id="price" name="price" type="number" min="0" step="0.01" required defaultValue={product?.price ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="unit">Unidade</label>
          <input id="unit" name="unit" required defaultValue={product?.unit ?? "kg"} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Descricao</label>
        <textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="active">Disponivel para venda</label>
        <select id="active" name="active" defaultValue={product?.active === false ? "false" : "true"}>
          <option value="true">Sim</option>
          <option value="false">Nao</option>
        </select>
      </div>

      {state.message ? (
        <div className={`badge ${state.success ? "" : "cancelled"}`}>{state.message}</div>
      ) : null}

      <button type="submit" className="button-primary" disabled={isPending}>
        {isPending ? "Salvando..." : product ? "Atualizar produto" : "Criar produto"}
      </button>
    </form>
  );
}
