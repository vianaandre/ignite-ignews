import {loadStripe} from '@stripe/stripe-js/pure';

// Stripe.js will not be loaded until `loadStripe` is called
export const getStripeJs = async () => {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

  return stripeJs
} 