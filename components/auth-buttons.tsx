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
    <>
      <span className="pill-link">{profile.full_name ?? "Conta ativa"}</span>
      <button type="button" className="pill-link" onClick={handleLogout}>
        Sair
      </button>
    </>
  );
}
