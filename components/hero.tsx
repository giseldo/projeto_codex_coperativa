import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-card">
        <div className="eyebrow">Viçosa/AL + IFAL</div>
        <h1>Uma ponte direta entre o campus e a agricultura familiar.</h1>
        <p>
          O Grupo de Consumo Campo no Campus organiza pedidos semanais com foco em preco justo, alimentacao saudavel e fortalecimento da economia solidaria.
        </p>
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
        <article className="hero-card highlight">
          <div className="eyebrow">Fluxo simples</div>
          <h3>Escolha, finalize e envie comprovante</h3>
          <p className="muted">Tudo em uma jornada curta, leve no celular e pronta para impressao do pedido.</p>
        </article>

        <article className="hero-card highlight">
          <div className="eyebrow">Gestao eficiente</div>
          <h3>Produtos, pedidos e relatorios em um so painel</h3>
          <p className="muted">A equipe administrativa acompanha pagamento, comprovantes e exporta resumo semanal em CSV.</p>
        </article>
      </div>
    </section>
  );
}
