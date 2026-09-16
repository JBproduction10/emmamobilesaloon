# Bare & Gloss — Next.js

Migrated from Vite + React to Next.js (App Router).

## What changed from the Vite version

- **Routing/build**: Vite → Next.js App Router (`next dev` / `next build` / `next start`).
- **Entry point**: `src/main.tsx` + `index.html` → `app/layout.tsx` (root layout + metadata) and `app/page.tsx` (the page itself, still a client component since it uses `useState`/`useMemo` and DOM events).
- **Booking API**: `api/book.ts` (a Vercel serverless function) → `app/api/book/route.ts` (a Next.js Route Handler). Same logic — tries email (Gmail), SMS, and WhatsApp (Twilio), skipping any channel whose env vars aren't set.
- **Fonts**: the Google Fonts `@import` in `index.css` → `next/font/google` in `app/layout.tsx` (self-hosted at build time, faster and no render-blocking request).
- **Styles**: `src/index.css` → `app/globals.css`, unchanged apart from font references. `src/App.css` was dead code (never imported) and was dropped.
- **Icons/manifest**: the `<link>` tags in `index.html` → the Next.js `metadata` export in `app/layout.tsx`.
- **`vercel.json` SPA rewrite**: removed — Next.js handles routing natively, no rewrite needed.

## Local development

```bash
npm install
cp .env.example .env   # fill in the channel(s) you want to test — see below
npm run dev
```

Runs at `http://localhost:3000`, frontend **and** `/api/book` together — no separate `vercel dev` step needed like the Vite version required.

## Environment variables

Same as before — copy `.env.example` to `.env` locally, and add the same variables in Vercel's dashboard (Project → Settings → Environment Variables) for production. Each channel (email / SMS / WhatsApp) is independent; any channel with missing vars is silently skipped.

## Deploying

Push to Git and import in Vercel, or run `vercel` from this folder. Next.js on Vercel is zero-config — `app/api/book/route.ts` is automatically deployed as a serverless function.
