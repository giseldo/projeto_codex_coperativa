import Link from "next/link";

import { Profile } from "@/lib/types";

import { AuthButtons } from "@/components/auth-buttons";
import { CartIndicator } from "@/components/cart-indicator";

export function SiteHeader({ profile }: { profile: Profile | null }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span>Economia solidaria</span>
          <strong>Campo no Campus</strong>
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Inicio
          </Link>
          <Link href="/checkout" className="nav-link">
            Cesta
          </Link>
          {profile?.role === "admin" ? (
            <Link href="/admin" className="nav-link">
              Painel admin
            </Link>
          ) : profile ? (
            <Link href="/cliente" className="nav-link">
              Minha area
            </Link>
          ) : null}
        </nav>

        <div className="header-actions">
          <CartIndicator />
          <AuthButtons profile={profile} />
        </div>
      </div>
    </header>
  );
}
