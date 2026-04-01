import type { Metadata } from "next";
import Link from "next/link";

import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "Grupo de Consumo Campo no Campus",
  description:
    "Plataforma de pedidos do Grupo de Consumo Campo no Campus, conectando servidores do IFAL a agricultores familiares de Viçosa/AL."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <div className="page-shell">
            <SiteHeader profile={profile} />
            <main className="page-content">{children}</main>
            <footer className="site-footer">
              <div>
                <strong>Grupo de Consumo Campo no Campus</strong>
                <p>Economia solidária, alimentação saudável e apoio à agricultura familiar.</p>
              </div>
              <Link href="/admin/relatorios">Relatórios semanais</Link>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
