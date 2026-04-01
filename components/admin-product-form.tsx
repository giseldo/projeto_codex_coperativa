"use client";

import { useActionState, useEffect } from "react";

import { saveProductAction } from "@/lib/actions";
import { Product } from "@/lib/types";

const initialState = { success: false, message: "" };
const categoryOptions = [
  "Frutas",
  "Verduras e Legumes",
  "Raízes",
  "Grãos",
  "Hortaliças",
  "Doces",
  "Bolos, Pães e Biscoitos",
  "Conservas e Derivados",
  "Bebidas Artesanais",
  "Extrativismo Sustentável",
  "Proteínas"
];

export function AdminProductForm({ product }: { product?: Product | null }) {
  const [state, action, isPending] = useActionState(saveProductAction, initialState);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("product-form") as HTMLFormElement | null;
      if (form && !product) form.reset();
    }
  }, [product, state.success]);

  return (
    <form id="product-form" action={action} className="card form-grid admin-form-card">
      <div className="section-title admin-form-header">
        <div>
          <h3>{product ? "Editar produto" : "Novo produto"}</h3>
          <p className="muted">Cadastre itens da cesta com categoria, preço, unidade e foto para o catálogo.</p>
        </div>
      </div>

      <input type="hidden" name="id" defaultValue={product?.id ?? ""} />

      <div className="product-image-preview">
        {product?.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image-preview__img" />
        ) : (
          <div className="product-image-preview__placeholder">Sem foto cadastrada</div>
        )}
      </div>

      <div className="field">
        <label htmlFor="productImage">Foto do produto</label>
        <input id="productImage" name="productImage" type="file" accept=".png,.jpg,.jpeg,.webp" />
      </div>

      <div className="field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" required defaultValue={product?.name ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select id="category" name="category" defaultValue={product?.category ?? "Frutas"}>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="form-grid two">
        <div className="field">
          <label htmlFor="price">Preço</label>
          <input id="price" name="price" type="number" min="0" step="0.01" required defaultValue={product?.price ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="unit">Unidade</label>
          <input id="unit" name="unit" required defaultValue={product?.unit ?? "kg"} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Descrição</label>
        <textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="active">Disponível para venda</label>
        <select id="active" name="active" defaultValue={product?.active === false ? "false" : "true"}>
          <option value="true">Sim</option>
          <option value="false">Não</option>
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
