import { FreemiumState } from '../types';

const STORAGE_KEY = 'docsweep_session_pass';
export const FREE_PDF_LIMIT = 10;

/**
 * Retrieves current freemium status from sessionStorage
 */
export function getStoredFreemiumState(): FreemiumState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { isUnlocked: false, maxDocs: FREE_PDF_LIMIT, token: null, plan: 'free' };
    }
    const parsed = JSON.parse(raw);
    return {
      isUnlocked: !!parsed.unlocked,
      maxDocs: parsed.maxDocs || 500,
      token: parsed.token || null,
      plan: parsed.plan || 'batch_100',
    };
  } catch {
    return { isUnlocked: false, maxDocs: FREE_PDF_LIMIT, token: null, plan: 'free' };
  }
}

/**
 * Saves unlocked pass to sessionStorage
 */
export function saveFreemiumState(state: FreemiumState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
    unlocked: state.isUnlocked,
    maxDocs: state.maxDocs,
    token: state.token,
    plan: state.plan,
  }));
}

/**
 * Verifies a Stripe session ID returned via query parameters
 */
export async function verifyStripeSession(sessionId: string): Promise<FreemiumState | null> {
  try {
    const response = await fetch('/api/payment/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      console.warn('Session verification failed on server');
      return null;
    }

    const data = await response.json();
    if (data.success) {
      const newState: FreemiumState = {
        isUnlocked: true,
        maxDocs: data.max_docs || 500,
        token: data.token,
        plan: data.plan || 'batch_100',
      };
      saveFreemiumState(newState);
      return newState;
    }
    return null;
  } catch (err) {
    console.error('Error verifying Stripe session:', err);
    return null;
  }
}

/**
 * Gets payment link URL based on plan or falls back to standard Stripe Checkout
 */
export function getPaymentLinkForPlan(plan: 'batch_100' | 'batch_500' | 'batch_pro'): string {
  const envKey = plan === 'batch_100' 
    ? (import.meta.env.VITE_STRIPE_PAYMENT_LINK_299 || 'https://buy.stripe.com/demo_299')
    : plan === 'batch_500' 
    ? (import.meta.env.VITE_STRIPE_PAYMENT_LINK_499 || 'https://buy.stripe.com/demo_499')
    : (import.meta.env.VITE_STRIPE_PAYMENT_LINK_999 || 'https://buy.stripe.com/demo_999');

  return envKey;
}
