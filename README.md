# 🛍️ Shopify Orders Webhook Integration (NestJS + Drizzle + Docker)

Este projeto é uma API desenvolvida em **NestJS** com **Drizzle ORM** e **PostgreSQL**, com o objetivo de integrar com a **API da Shopify**. Ele realiza a autenticação OAuth de lojas Shopify e recebe **webhooks de criação de pedidos (orders/create)**.

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração inicial na Shopify](#configuração-inicial-na-shopify)
- [Configurando um domínio público (ngrok ou alternativo)](#configurando-um-domínio-público-ngrok-ou-alternativo)
- [Configuração do Projeto](#configuração-do-projeto)
- [Rodando o Projeto](#rodando-o-projeto)
  - [Opção 1: Usando Docker](#opção-1-usando-docker)
  - [Opção 2: Usando Node.js/NPM](#opção-2-usando-nodejsnpm)
- [Testando a Integração](#testando-a-integração)
- [Webhooks Suportados](#webhooks-suportados)
- [(Opcional) Visualizando Dados Salvos no Banco)](#opcional-visualizando-dados-salvos-no-banco)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) - Um framework Node.js progressivo para criar aplicativos do lado do servidor eficientes, confiáveis e escaláveis.
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe operations on the database.
- [Shopify API](https://shopify.dev/docs/api) - APIs REST/GraphQL da Shopify utilizadas para autenticação OAuth e recepção de webhooks de pedidos.
- [Ngrok](https://ngrok.com/) - Túnel para expor a API local publicamente.
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional para persistência.
- [Docker](https://www.docker.com/) - Containerização da aplicação e do banco de dados.
- [Zod](https://zod.dev/) - Robust schema and data validation typescript first.

## Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js (>= 18.x)](https://nodejs.org)
- [Docker e Docker Compose](https://docs.docker.com/compose/install/)
- [[Ngrok](https://ngrok.com/) ou alternativa como [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)] para expor sua API local
- Conta de desenvolvedor na [Shopify](https://partners.shopify.com/)

## Configuração Inicial na Shopify

1. Acesse [Shopify Partners](https://partners.shopify.com/) e crie uma conta ou acesse a sua.

2. Crie um **app customizado**:
    - Vá em **Apps** → **Create app** → **Custom App**.
    - Escolha um nome, por exemplo: `Webhook Orders App`.

3. Gere as credenciais:
    - Salve o **API Key** (client ID) e **API Secret** para o arquivo `.env`.

4. Crie uma **loja de teste**:
    - Vá em **Lojas** → **Adicionar Loja** → **Criar loja de desenvolvimento**.
    - Escolha um nome e confirme a criação.

7. Instale o app na loja de teste:
    - Vá em **Apps** e selecine o app criado.
    - Em seguida, vá para **Distribuição** e selecione **Domínio personalizado**.
    - Insira o link da sua loja de teste (exemplo: `nome-da-loja.myshopify.com`).
    - Copie o link de instalação gerado e abra-o em uma aba em seu navegador. 
    - Confirme a instalação do app na sua loja.

## Configurando um Domínio Público (Ngrok ou Alternativo)

Para exemplificação, será demonstrado utilizando o **Ngrok**.

Antes de rodar o projeto:

1. Instale o [Ngrok](https://ngrok.com/) e rode:

    ```bash
    ngrok http 3000
    ```
   
2. Copie a URL gerada (https://abcd1234.ngrok.io).

3. Aplique-o:
   
    - No .env do projeto:

      ```env
      HOST=https://abcd1234.ngrok.io
      ```
  
    - No painel do app da Shopify:
      - Atualize o campo App URL e Redirect URL com essa mesma URL.
      
      > Lembre-se de manter **App URL** com `https://<dominio-ngrok>/auth/shopify` e **Redirect URL** com `https://<dominio-ngrok>/auth/shopify/redirect`.

## Configuração do Projeto

1. Crie um arquivo .env baseado no .env.example:

```env
# Server Configuration
PORT=3000 # HTTP server port

# Database Connection
DATABASE_HOST=nestshop-db         # e.g., service name in docker-compose.yml
DATABASE_USER=postgres            # your DB username
DATABASE_PASSWORD=postgres        # your DB password
DATABASE_PORT=5432                # default PostgreSQL port
DATABASE_NAME=nestshop            # your DB name
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
DATABASE_URL=postgresql://postgres:postgres@nestshop-db:5432/nestshop?schema=public

# Shopify App Credentials
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_orders
SHOPIFY_API_VERSION=2025-07 # Shopify API version

# Public App URL (Ngrok or Custom Domain)
HOST=https://your-ngrok-subdomain.ngrok-free.app
```

2. (Opcional) Caso desejar visualizar os dados salvos no banco você pode utilizar a ferramenta [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) do Drizzle Kit. Para isso, crie um `.env.studio` com:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestshop?schema=public
```

> Observação: Observe que a URL é semelhante à do `.env` porém muda-se o `DATABASE_HOST`, cujo valor padrão é `nestshop-db`, mas no Drizzle Studio deve ser `localhost` para que esse consiga se conectar com o banco.

## Rodando o Projeto

### Opção 1: Usando Docker

> Recomendado para ambientes de desenvolvimento isolado.

```bash
docker-compose up --build
```

### Opção 2: Usando Node.js/NPM

- Instale dependências:

  ```bash
  npm install
  ```

- Inicie o banco via Docker:

  ```bash
  docker-compose up -d postgres
  ```

- Aplique as migrações:

  ```bash
  npm run db:migrate
  ```

- Rode o projeto:

  ```bash
  npm run start:dev
  ```

## Testando a Integração

1. Acesse a área de administrador da sua loja de teste criada:

```bash
https://admin.shopify.com/store/nome-loja-teste
```

2. Crie um produto e um pedido para esse (você pode tentar também criar um cliente e endereço de entrega para testar com os dados completos).

3. A Shopify começará a enviar webhooks para:

```bash
POST https://abcd1234.ngrok.io/webhooks/orders/create
```

## Webhooks Suportados

Atualmente, este projeto escuta apenas:

- `orders/create`: Recebe informações de novos pedidos realizados na loja.

## (Opcional) Visualizando Dados Salvos no Banco

Caso você tenha criado um `.env.studio` e configurado a `DATABASE_URL` para o **Drizzle Studio**, você pode visualizar os dados salvos no banco executando, em um novo terminal na raiz do projeto, o comando:

```bash
npm run db:studio
```
Abra o Drizzle Studio em [https://local.drizzle.studio]().

## Estrutura do Projeto

```bash
src/
├── auth/                 # Módulo de autenticação OAuth com Shopify
│   └── dto/              # Data Transfer Objects usados pelos métodos de autenticação
├── common/               # Código compartilhado
│   └── interceptors/     # Interceptadores reutilizáveis (ex: validação HMAC)
├── drizzle/              # Configuração do Drizzle ORM
│   ├── migrations/       # Arquivos de migração do banco de dados
│   ├── schema/           # Esquemas das tabelas do banco
│   └── types/            # Tipos TypeScript relacionados ao banco
│   ...
├── env/                  # Validação de variáveis de ambiente com zod
├── webhooks/             # Módulo de recebimento e tratamento dos webhooks da Shopify
│   └── dto/              # Data Transfer Objects usados pelos webhooks
│   ...
├── app.module.ts
├── main.ts
.env
docker-compose.yml
```

