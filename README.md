# Norov Local AI Landing

Mobile-first landing page for Meta Ads traffic.

## Run
```bash
npm install
npm run dev
```

## Environment
Create `.env` from `.env.example`. On Netlify, add the same variables under
**Site configuration → Environment variables**, then trigger a fresh deploy.

After marketing-cookie consent, CTA buttons fire `InitiateCheckout`. The checkout URL passes the consent state to Stripe as a non-sensitive `client_reference_id`. A signed Stripe webhook sends `Purchase` to Meta CAPI only after Stripe reports a paid Checkout Session and the customer had accepted marketing cookies. The success page never fires a browser `Purchase` event.


## Important
The checkout buttons no longer scroll to the pricing section.
They open Stripe directly when `VITE_STRIPE_CHECKOUT_URL` is set.
If the variable is missing, the user sees a clear setup alert instead of a fake redirect.

## Environment variables

Add these variables locally in `.env` and in Netlify:

- `VITE_STRIPE_CHECKOUT_URL`
- `VITE_APP_LOGIN_URL`
- `VITE_SUPPORT_EMAIL`
- `VITE_META_PIXEL_ID`

Add these server-only variables in Netlify (never commit their real values):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `META_PIXEL_ID`
- `META_CONVERSIONS_API_TOKEN`
- `META_GRAPH_API_VERSION` (optional; defaults to `v23.0`)
- `META_TEST_EVENT_CODE` (temporary, only for Meta Test Events)

Create a Stripe webhook endpoint pointing to:

`https://norov-local-ai.netlify.app/.netlify/functions/stripe-webhook`

Subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
Set the Payment Link post-payment redirect to:

`https://norov-local-ai.netlify.app/payment-success?session_id={CHECKOUT_SESSION_ID}`

`VITE_APP_LOGIN_URL` must point to the software/login page, not back to this landing page.

The legal pages are available at `/privacy`, `/terms`, `/refunds`, and `/contacts`.
