"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";

export function ProfileSettingsForm({
  profile,
  email
}: {
  profile: Profile;
  email: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");
    setError("");

    startTransition(async () => {
      const supabase = createClient();
      const nextName = String(formData.get("fullName") || "").trim();
      const nextEmail = String(formData.get("email") || "").trim();
      const nextPassword = String(formData.get("password") || "");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: nextName })
        .eq("id", profile.id);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      const updatePayload: { data?: { full_name: string }; email?: string; password?: string } = {
        data: { full_name: nextName }
      };

      if (nextEmail && nextEmail !== email) {
        updatePayload.email = nextEmail;
      }

      if (nextPassword) {
        updatePayload.password = nextPassword;
      }

      const { error: userError } = await supabase.auth.updateUser(updatePayload);

      if (userError) {
        setError(userError.message);
        return;
      }

      setPassword("");
      setMessage(
        nextEmail && nextEmail !== email
          ? "Dados atualizados. Verifique o novo e-mail para confirmar a alteração de endereço."
          : "Dados atualizados com sucesso."
      );
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="card form-grid profile-form-card">
      <div className="section-title">
        <div>
          <div className="eyebrow">Perfil</div>
          <h2>Atualize seus dados</h2>
          <p className="muted">Altere nome, e-mail e senha com segurança.</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="fullName">Nome completo</label>
        <input id="fullName" name="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="password">Nova senha</label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          placeholder="Preencha apenas se quiser trocar a senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {message ? <div className="badge">{message}</div> : null}
      {error ? <div className="badge cancelled">{error}</div> : null}

      <button type="submit" className="button-primary" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
