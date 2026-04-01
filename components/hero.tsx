import Link from "next/link";

export function Hero() {
  return (
    <section className="hero hero--branded">
      <div className="hero-card hero-card--brand">
        <div className="hero-brand-lockup">
          <div className="hero-brand-medallion">
            <img src="/logo-campo-campus.svg" alt="Grupo de Consumo Campo no Campus" className="hero-brand-medallion__img" />
          </div>
          <div className="hero-brand-copy">
            <div className="eyebrow">Viçosa/AL + IFAL</div>
            <h1>Uma ponte elegante entre o campus e a agricultura familiar.</h1>
            <p>
              O Grupo de Consumo Campo no Campus organiza pedidos semanais com foco em preço justo, alimentação saudável e fortalecimento da economia solidária.
            </p>
          </div>
        </div>
        <div className="button-row">
          <Link href="/checkout" className="pill-link pill-link--solid">
            Abrir cesta
          </Link>
          <Link href="/login" className="pill-link">
            Entrar para comprar
          </Link>
        </div>
      </div>

      <div className="hero-highlights">
        <article className="hero-card highlight highlight--soft">
          <div className="eyebrow">Fluxo simples</div>
          <h3>Escolha, finalize e envie comprovante</h3>
          <p className="muted">Tudo em uma jornada curta, leve no celular e pronta para impressão do pedido.</p>
        </article>

        <article className="hero-card highlight highlight--soft">
          <div className="eyebrow">Gestão eficiente</div>
          <h3>Produtos, pedidos e relatórios em um só painel</h3>
          <p className="muted">A equipe administrativa acompanha pagamentos, comprovantes e exporta resumo semanal em CSV.</p>
        </article>
      </div>
    </section>
  );
}
