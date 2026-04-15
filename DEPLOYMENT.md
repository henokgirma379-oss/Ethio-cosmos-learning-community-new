# Ethio-Cosmos Deployment Guide

## 1. Supabase setup

Run these SQL files in order:

1. `supabase/migrations/20260404_000001_ethio_cosmos_schema.sql`
2. `supabase/migrations/20260404_000002_ethio_cosmos_seed.sql`

Then create these public buckets in Supabase Storage:

- `chat-images`
- `about-images`
- `materials`
- `avatars`

## 2. Environment variables

Set these in Vercel and local `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3. Vercel settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` already contains SPA rewrites.

## 4. Supabase Auth URL config

After deploying, add your production URL in Supabase:

- Site URL: `https://your-project.vercel.app`
- Redirect URLs:
  - `https://your-project.vercel.app/**`
  - `http://localhost:5173/**`

For Google OAuth, configure:

- Redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

## 5. Admin access

The database trigger auto-assigns admin role to:

- `henokgirma379@gmail.com`

## 6. Deploy flow

```bash
npm install
npm run build
```

Push to GitHub, import the repo into Vercel, add env vars, and deploy.

## 7. Common pitfalls

- Do not change Vite base from `/`
- Do not remove `vercel.json` rewrites
- Do not commit your real `.env`
- Make sure RLS policies are applied before using production auth and chat
