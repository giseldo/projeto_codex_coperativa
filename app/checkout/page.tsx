import Link from "next/link";

import { CartSummary } from "@/components/cart-summary";
import { CheckoutForm } from "@/components/checkout-form";
import { getCurrentProfile } from "@/lib/auth";

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="two-columns">
      <div className="grid">
        <CartSummary />
      </div>

      {profile ? (
        <CheckoutForm profile={profile} />
      ) : (
        <div className="card form-grid">
          <div className="section-title">
            <div>
              <h2>Entrar para finalizar</h2>
              <p className="muted">O login e necessario para associar o pedido ao historico do comprador.</p>
            </div>
          </div>
          <Link href="/login" className="pill-link pill-link--solid">
            Fazer login
          </Link>
        </div>
      )}
    </div>
  );
}
