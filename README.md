# Grupo de Consumo Campo no Campus

Plataforma web para gestão de pedidos, pagamentos e relatórios do projeto de economia solidária Campo no Campus.

## Stack

- Next.js 15 + React 19 + TypeScript
- Supabase para autenticação, banco e armazenamento de comprovantes
- CSS customizado com interface responsiva para celular e desktop

## Como rodar

1. Instale as dependências:
   `npm install`
2. Crie um arquivo `.env.local` com base em `.env.example`.
3. No Supabase, execute o SQL de `supabase/schema.sql`.
4. Defina pelo menos um usuário admin atualizando a tabela `profiles`:
   `update public.profiles set role = 'admin' where id = 'UUID_DO_USUARIO';`
5. Rode o projeto:
   `npm run dev`

## Recursos implementados

- Catálogo público com cesta de compras
- Login e cadastro de usuários
- Checkout com upload de comprovante
- Histórico do cliente e resumo imprimível do pedido
- Painel admin para produtos, pedidos e relatório semanal
- Exportação CSV dos pedidos consolidados

## Variáveis de ambiente

Use os valores de `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Observações

- O bucket `payment-proofs` é criado pelo script SQL com leitura pública para facilitar a abertura de comprovantes no painel admin.
- O bucket `product-images` é usado para armazenar as fotos reais dos produtos.
