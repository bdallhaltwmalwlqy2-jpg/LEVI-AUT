# LEVI-AUT

Premium dark-first authentication surface built with Next.js, TypeScript, Tailwind CSS and Supabase Auth.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Keep the service-role key out of the frontend.

Optional OAuth providers are controlled by `NEXT_PUBLIC_ENABLED_OAUTH_PROVIDERS`, for example `google,github`. Only providers listed there render in the UI; they must also be enabled and configured in Supabase Authentication → Providers.

## Supabase dashboard settings

Add these URLs under Authentication → URL Configuration:

- Local: `http://localhost:3000/auth/callback`
- Production: `https://YOUR_VERCEL_DOMAIN/auth/callback`

Set the Site URL to the production URL once deployed. For OAuth, copy the provider callback URL shown by Supabase into the provider console.

## Vercel

Import the GitHub repository into Vercel and add the same environment variables. Deploy with the default Next.js settings. The production URL must be added to Supabase Redirect URLs before testing OAuth, magic links and password reset.

## Current scope

- Real email/password authentication
- Magic link flow
- Password reset email flow
- OAuth callback infrastructure
- Configurable, non-fake OAuth provider buttons
- Session persistence and refresh middleware
- English/Arabic UI with RTL support
- Temporary authenticated dashboard with provider and logout
