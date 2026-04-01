import Link from "next/link";

import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { getCurrentProfile, requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return (
    <div className="grid">
      <section className="hero-card">
        <div className="eyebrow">Minha conta</div>
        <h1>Dados de acesso e cadastro</h1>
        <p>Gerencie as informações da sua conta e mantenha seus dados atualizados.</p>
      </section>

      <div className="two-columns">
        <ProfileSettingsForm profile={profile} email={user.email ?? ""} />
        <section className="card profile-side-card">
          <div className="section-title">
            <div>
              <h2>Resumo da conta</h2>
              <p className="muted">As permissões atuais aparecem abaixo.</p>
            </div>
          </div>

          <div className="grid" style={{ gap: 14 }}>
            <div>
              <div className="eyebrow">Nome</div>
              <strong>{profile.full_name ?? "Não informado"}</strong>
            </div>
            <div>
              <div className="eyebrow">E-mail</div>
              <strong>{user.email ?? "Não informado"}</strong>
            </div>
            <div>
              <div className="eyebrow">Perfil</div>
              <span className="badge">{profile.role === "admin" ? "Administrador" : "Cliente"}</span>
            </div>
            <div className="button-row">
              <Link href={profile.role === "admin" ? "/admin" : "/cliente"} className="pill-link">
                Voltar
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
