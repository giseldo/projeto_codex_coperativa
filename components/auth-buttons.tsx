"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";

export function AuthButtons({ profile }: { profile: Profile | null }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  if (!profile) {
    return (
      <>
        <Link href="/login" className="pill-link">
          Entrar
        </Link>
        <Link href="/login?mode=signup" className="pill-link pill-link--solid">
          Criar conta
        </Link>
      </>
    );
  }

  return (
    <div className="account-panel">
      <div className="account-panel__identity">
        <span className="account-panel__label">Conta conectada</span>
        <strong className="account-panel__name">{profile.full_name ?? "Usuário"}</strong>
        <span className="account-panel__role">{profile.role === "admin" ? "Administrador" : "Cliente"}</span>
      </div>
      <div className="account-panel__actions">
        <Link href="/perfil" className="account-panel__link">
          Editar dados
        </Link>
        <button type="button" className="account-panel__link" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}
