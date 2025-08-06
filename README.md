# 🛍️ Shopify Orders Webhook Integration (NestJS + Drizzle + Docker)

This project is an API developed using **NestJS** with **Drizzle ORM** and **PostgreSQL**, designed to integrate with the **Shopify API**. It handles OAuth authentication for Shopify stores and receives **order creation webhooks (orders/create)**.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Initial Setup on Shopify](#initial-setup-on-shopify)
- [Setting Up a Public Domain (ngrok or alternative)](#setting-up-a-public-domain-ngrok-or-alternative)
- [Project Configuration](#project-configuration)
- [Running the Project](#running-the-project)
  - [Option 1: Using Docker](#option-1-using-docker)
  - [Option 2: Using Node.js/NPM](#option-2-using-nodejsnpm)
- [API Endpoints](#api-endpoints)
- [Testing the Integration](#testing-the-integration)
- [Supported Webhooks](#supported-webhooks)
- [(Optional) Viewing Saved Data in the Database](#-optional-viewing-saved-data-in-the-database)
- [Project Structure](#project-structure)

## Technologies Used

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe operations on the database.
- [Shopify API](https://shopify.dev/docs/api) - Shopify’s REST/GraphQL APIs used for OAuth authentication and order webhooks.
- [Ngrok](https://ngrok.com/) - Tunnel to expose your local API to the internet.
- [PostgreSQL](https://www.postgresql.org/) - Relational database for data persistence.
- [Docker](https://www.docker.com/) - Containerization for the application and database.
- [Zod](https://zod.dev/) - TypeScript-first schema and data validation.

## Prerequisites

Before getting started, make sure you have:

- [Node.js (>= 18.x)](https://nodejs.org)
- [Docker and Docker Compose](https://docs.docker.com/compose/install/)
- [[Ngrok](https://ngrok.com/) or an alternative like [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)]  to expose your local API
- A developer account on [Shopify](https://partners.shopify.com/)

## Initial Setup on Shopify

1. Go to [Shopify Partners](https://partners.shopify.com/) and log in or create an account.

2. Create a **custom app**:
    - Navigate to **Apps** → **Create app** → **Custom App**.
    - Choose a name, for example: `Webhook Orders App`.

3. Generate credentials:
    - Save the **API Key** (client ID) and **API Secret** into the .env file.

4. Create a **test store**:
    - Go to **Stores** → **Add store** → **Create development store**.
    - Choose a name and confirm creation.

5. Install the app in the test store:
    - Go to **Apps** and select the created app.
    - Then go to **Distribution** and select **Custom domain**.
    - Enter your test store URL (e.g., `store-name.myshopify.com`).
    - Copy the generated installation link and open it in a browser tab.
    - Confirm the app installation in your test store.

## Setting Up a Public Domain (Ngrok or Alternative)

For demonstration purposes, **Ngrok** will be used.

Before running the project:

1. Install [Ngrok](https://ngrok.com/) and run:

    ```bash
    ngrok http 3000
    ```

    > **Note**: Port 3000 is just a common default used for NestJS apps. Replace it with the actual port your application is running on locally (e.g., ngrok http 3333 if your app runs on port 3333).
   
2. Copy the generated URL (e.g., `https://abcd1234.ngrok.io`).

3. Apply it:
   
    - In the project’s `.env` file:

      ```env
      HOST=https://abcd1234.ngrok.io
      ```
  
    - In the Shopify app dashboard:
      - Update the **App URL** and **Redirect URL** fields with this URL.
      
      > Remember to set **App URL** as `https://<ngrok-domain>/auth/shopify` and **Redirect URL** as `https://<ngrok-domain>/auth/shopify/redirect`.

## Project Configuration

1. Create a `.env` file based on `.env.example`:

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

2. (Optional) If you want to view the saved data using [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview), create a `.env.studio` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestshop?schema=public
```

> **Note**: The URL is similar to the one in `.env`, but the `DATABASE_HOST` changes from `nestshop-db` to `localhost` so Drizzle Studio can connect locally.

## Running the Project

### Option 1: Using Docker

> Recommended for isolated development environments.

```bash
docker-compose up --build
```

### Option 2: Using Node.js/NPM

- Install dependencies:

  ```bash
  npm install
  ```

- Start the database via Docker:

  ```bash
  docker-compose up -d nestshop-db
  ```

  >  **Note**: `nestshop-db` is the service name defined for the database in the `docker-compose.yml` file. The default port for the `nesthop-db` service is `5432`, as it uses PostgreSQL.  
  > Make sure no other service is already using this port on your machine before starting the container, otherwise it may fail to start due to a port conflict.

- Apply the migrations:

  To apply the database migrations locally (outside Docker), make sure to update your `.env` and `.env.studio` file to use `localhost` instead of the Docker hostname (`nestshop-db`) in the `DATABASE_URL`. For example:

  ```bash
  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestshop?schema=public
  ```

  Then run:

  ```bash
  npm run db:migrate
  ```

- Run the project:

  ```bash
  npm run start:dev
  ```

## API Endpoints

You can explore and test the available API endpoints using the documentation below.

The default base URL is usually one of the following, depending on your setup:

- Local development: `http://localhost:3000`
- Ngrok (or similar tunnel): `https://your-ngrok-subdomain.ngrok.io`
- Custom domain: `https://your-custom-domain.com`

- `GET /health` - Verifies if the API is running properly.
- `GET /auth/shopify` - Starts the Shopify OAuth authentication flow.
- `GET /auth/shopify/redirect` - Handles the OAuth redirect after authentication.
- `POST /webhooks/orders/create` - Receives Shopify order creation webhooks.
- `GET /orders` - Retrieves all saved orders with details.

## Testing the Integration

1. Access the admin panel of your test store:

```bash
https://admin.shopify.com/store/nome-loja-teste
```

2. Create a product and an order for it (you may also create a customer and shipping address to test with complete data).

3. Shopify will start sending webhooks to:

```bash
POST https://abcd1234.ngrok.io/webhooks/orders/create
```

## Supported Webhooks

Currently, this project only listens to:

- `orders/create`: Receives information about new orders placed in the store.

## (Optional) Viewing Saved Data in the Database

If you created a `.env.studio` file and configured the `DATABASE_URL` for **Drizzle Studio**, you can view the saved data by running the following command from the project root in a new terminal:

```bash
npm run db:studio
```

Then open Drizzle Studio at [https://local.drizzle.studio]().

## Project Structure

```bash
src/
├── auth/                 # OAuth authentication module with Shopify
│   └── dto/              # Data Transfer Objects used by the auth methods
│   ...
├── common/               # Shared code
│   ├── dto/              # Reusable DTOs shared across modules (e.g., Shopify Webhooks)
│   ├── interceptors/     # Reusable interceptors (e.g., HMAC validation)
│   └── mapper/           # Functions to transform and map external data (e.g., Shopify → DB format)
├── drizzle/              # Drizzle ORM configuration
│   ├── migrations/       # Database migration files
│   ├── schema/           # Database table schemas
│   └── types/            # TypeScript types related to the database
│   ...
├── env/                  # Environment variable validation using zod
├── webhooks/             # Shopify webhooks receiving and handling module
├── app.module.ts
├── main.ts
.env
docker-compose.yml
```

## Author

Made by [Marcos Antonio](https://github.com/MarcosAntonio15243).

- 💻 Full Stack developer dedicated to building complete solutions by combining modern, functional user interfaces with robust back-end architectures.
- 🚀 Always open to feedback, collaboration, or ideas for improvement!
- 📫 Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/marcos-antonio-18059b234) or check out more of my projects here on GitHub.