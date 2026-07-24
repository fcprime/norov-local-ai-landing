# Norov Local AI Landing

Mobile-first landing page for Meta Ads traffic.

## Run
```bash
npm install
npm run dev
```

## Environment
Create `.env` from `.env.example`.

CTA buttons fire `InitiateCheckout`. Fire `Purchase` only on a verified success page after Stripe confirms payment, not on the checkout button. Use the “first 10 users” claim only while it is factually true.


## Important
The checkout buttons no longer scroll to the pricing section.
They open Stripe directly when `VITE_STRIPE_CHECKOUT_URL` is set.
If the variable is missing, the user sees a clear setup alert instead of a fake redirect.

## Environment variables

Add these variables locally in `.env` and in Netlify:

- `VITE_STRIPE_CHECKOUT_URL`
- `VITE_APP_LOGIN_URL`
- `VITE_SUPPORT_EMAIL`

The legal pages are available at `/privacy`, `/terms`, `/refunds`, and `/contacts`.
