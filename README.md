# ShopNest

ShopNest is a Next.js e-commerce application powered by the Route Academy E-commerce API.

## Requirements

- Node.js 20 or newer
- npm

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and add:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=replace-with-a-long-random-secret
   ```

   Generate a secret with `openssl rand -base64 32` or another secure random generator. Never commit `.env.local`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

## Authentication notes

- Credentials are validated by the Route Academy API.
- NextAuth stores the API access token in its encrypted JWT cookie.
- Store API requests run through server actions, so the API token is not intentionally exposed to browser components.
- The token is read from the `accessToken` JWT property. Keep this name consistent in the NextAuth JWT callback and token helper.

## Deployment

Set `NEXTAUTH_URL` to the deployed site URL and configure a strong `NEXTAUTH_SECRET` in the hosting provider's environment variables. Do not use the local `.env.local` file in production.
