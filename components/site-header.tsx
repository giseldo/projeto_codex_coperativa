import Link from "next/link";

import { Profile } from "@/lib/types";

import { AuthButtons } from "@/components/auth-buttons";
import { CartIndicator } from "@/components/cart-indicator";

export function SiteHeader({ profile }: { profile: Profile | null }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand brand--with-logo">
          <span className="brand-logo-shell">
            <img src="/logo-campo-campus.svg" alt="Grupo de Consumo Campo no Campus" className="brand-logo" />
          </span>
          <span className="brand-copy">
            <span>Economia solidária</span>
            <strong>Campo no Campus</strong>
            <em>IFAL + agricultura familiar de Viçosa/AL</em>
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Início
          </Link>
          {profile?.role === "admin" ? (
            <Link href="/admin" className="nav-link">
              Painel admin
            </Link>
          ) : profile ? (
            <Link href="/cliente" className="nav-link">
              Minha área
            </Link>
          ) : null}
        </nav>

        <div className="header-actions header-actions--account">
          <CartIndicator />
          <AuthButtons profile={profile} />
        </div>
      </div>
    </header>
  );
}
