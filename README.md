# Bare & Gloss — Mobile Beauty Studio

## Booking notifications

When someone submits the booking form, it POSTs to a Vercel serverless
function at `api/book.ts`, which notifies you by **email (Gmail)**, **SMS**,
and/or **WhatsApp** — each channel is independent and only runs if its
environment variables are set.

### 1. Set up Gmail (email)

1. Turn on 2-Step Verification on the Google account you want to send from:
   https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
   (choose "Mail" as the app) — you'll get a 16-character password.
3. In Vercel, set:
   - `GMAIL_USER` — the Gmail address sending the notification
   - `GMAIL_APP_PASSWORD` — the 16-character app password (not your login password)
   - `NOTIFY_EMAIL` — where booking emails should be delivered (can be the same address)

### 2. Set up Twilio (SMS and/or WhatsApp)

1. Create a free account at https://www.twilio.com and grab your
   **Account SID** and **Auth Token** from the console dashboard.
2. For **SMS**: buy/verify an SMS-capable Twilio number, then set:
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
   - `TWILIO_SMS_FROM` — your Twilio number, e.g. `+15551234567`
   - `NOTIFY_PHONE` — the number that should receive the SMS
3. For **WhatsApp**: easiest way to start is Twilio's WhatsApp Sandbox
   (https://www.twilio.com/docs/whatsapp/sandbox) — join the sandbox from
   your own WhatsApp, then set:
   - `TWILIO_WHATSAPP_FROM` — the Twilio WhatsApp number (sandbox default is `+14155238886`)
   - `NOTIFY_WHATSAPP` — the WhatsApp number that should receive the message
   - When ready for production, apply for a real WhatsApp sender through Twilio
     and swap `TWILIO_WHATSAPP_FROM` for that number.

See `.env.example` for the full list with sample values.

### 3. Add the variables in Vercel

Project → Settings → Environment Variables → add each one → redeploy.
For local testing, copy `.env.example` to `.env` and run `vercel dev`
(`npm i -g vercel` if you don't have it) so the `/api` function runs locally.

Any channel left unconfigured is silently skipped — nothing breaks if you
only set up email for now and add SMS/WhatsApp later.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
