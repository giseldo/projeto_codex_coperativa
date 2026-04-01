"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [currentMode, setCurrentMode] = useState<"login" | "signup">(mode);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    setMessage("");
    const fullName = String(formData.get("fullName") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createClient();

    startTransition(async () => {
      if (currentMode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setMessage("Conta criada. Se a confirmação por e-mail estiver ativa, valide seu acesso antes de entrar.");
        setCurrentMode("login");
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/cliente");
      router.refresh();
    });
  }

  return (
    <div className="two-columns">
      <section className="hero-card">
        <div className="eyebrow">Acesso à plataforma</div>
        <h1>Compre direto da agricultura familiar.</h1>
        <p>
          Acesse sua conta para montar pedidos, acompanhar compras anteriores e enviar comprovantes de pagamento com poucos cliques.
        </p>
      </section>

      <form action={handleSubmit} className="card form-grid">
        <div className="section-title">
          <div>
            <h2>{currentMode === "signup" ? "Criar conta" : "Entrar"}</h2>
            <p className="muted">Use um e-mail pessoal ou institucional para acessar a plataforma.</p>
          </div>
        </div>

        {currentMode === "signup" ? (
          <div className="field">
            <label htmlFor="fullName">Nome completo</label>
            <input id="fullName" name="fullName" required />
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" minLength={6} required />
        </div>

        {message ? <div className="badge">{message}</div> : null}
        {error ? <div className="badge cancelled">{error}</div> : null}

        <div className="button-row">
          <button type="submit" className="button-primary" disabled={isPending}>
            {isPending ? "Enviando..." : currentMode === "signup" ? "Criar conta" : "Entrar"}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setCurrentMode(currentMode === "signup" ? "login" : "signup")}
          >
            {currentMode === "signup" ? "Já tenho conta" : "Criar nova conta"}
          </button>
        </div>
      </form>
    </div>
  );
}
