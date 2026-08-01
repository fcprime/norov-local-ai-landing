import Stripe from 'stripe';
import crypto from 'node:crypto';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const sha256 = (value) => crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const pixelId = process.env.META_PIXEL_ID || '1533458127771797';
  const capiToken = process.env.META_CONVERSIONS_API_TOKEN;
  const graphVersion = process.env.META_GRAPH_API_VERSION || 'v23.0';
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!stripeSecretKey || !webhookSecret || !pixelId || !capiToken) {
    console.error('Missing Stripe or Meta environment variables');
    return json(500, { error: 'Server configuration error' });
  }

  const stripe = new Stripe(stripeSecretKey);
  let stripeEvent;

  try {
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
  } catch (error) {
    console.error('Invalid Stripe webhook signature', error.message);
    return json(400, { error: 'Invalid signature' });
  }

  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(stripeEvent.type)) {
    return json(200, { received: true, ignored: true });
  }

  const session = stripeEvent.data.object;
  if (session.payment_status !== 'paid') return json(200, { received: true, ignored: true });
  if (session.client_reference_id !== 'meta_consent') {
    return json(200, { received: true, ignored: true, reason: 'no_marketing_consent' });
  }

  const email = session.customer_details?.email || session.customer_email;
  const userData = {};
  if (email) userData.em = [sha256(email)];
  if (session.customer) userData.external_id = [sha256(String(session.customer))];

  if (!Object.keys(userData).length) {
    console.error('Paid Stripe session has no usable customer identifier', session.id);
    return json(500, { error: 'Missing customer identifier' });
  }

  // The browser Purchase on /payment-success uses this same ID, allowing Meta
  // to deduplicate browser and server events when both arrive.
  const eventId = `stripe_${session.id}`;
  const amount = typeof session.amount_total === 'number' ? session.amount_total / 100 : 19;
  const currency = (session.currency || 'eur').toUpperCase();
  const payload = {
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: `https://norov-local-ai-landing.netlify.app/payment-success?session_id=${encodeURIComponent(session.id)}`,
      user_data: userData,
      custom_data: {
        currency,
        value: amount,
        order_id: session.payment_intent || session.id,
        content_name: 'Norov Local AI — 60 days',
      },
    }],
  };
  if (testEventCode) payload.test_event_code = testEventCode;

  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pixelId}/events?access_token=${encodeURIComponent(capiToken)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error('Meta CAPI rejected Purchase', result);
    return json(502, { error: 'Meta CAPI request failed' });
  }

  return json(200, { received: true, event_id: eventId });
};
