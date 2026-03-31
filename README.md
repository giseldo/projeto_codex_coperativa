# Grupo de Consumo Campo no Campus

Plataforma web para gestao de pedidos, pagamentos e relatorios do projeto de economia solidaria Campo no Campus.

## Stack

- Next.js 15 + React 19 + TypeScript
- Supabase para autenticacao, banco e armazenamento de comprovantes
- CSS customizado com interface responsiva para celular e desktop

## Como rodar

1. Instale as dependencias:
   `npm install`
2. Crie um arquivo `.env.local` com base em `.env.example`.
3. No Supabase, execute o SQL de `supabase/schema.sql`.
4. Defina pelo menos um usuario admin atualizando a tabela `profiles`:
   `update public.profiles set role = 'admin' where id = 'UUID_DO_USUARIO';`
5. Rode o projeto:
   `npm run dev`

## Recursos implementados

- Catalogo publico com cesta de compras
- Login e cadastro de usuarios
- Checkout com upload de comprovante
- Historico do cliente e resumo imprimivel do pedido
- Painel admin para produtos, pedidos e relatorio semanal
- Exportacao CSV dos pedidos consolidados

## Variaveis de ambiente

Use os valores de `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Observacoes

- O logo ainda nao foi incluido. A interface ja esta pronta para receber a identidade visual final.
- O bucket `payment-proofs` e criado pelo script SQL com leitura publica para facilitar a abertura de comprovantes no painel admin.
