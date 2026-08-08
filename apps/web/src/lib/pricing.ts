export const PREMIUM_PRICE_CENTS = 999;
export const PREMIUM_CURRENCY = 'eur';
export const PREMIUM_INTERVAL = 'month';

export function getPremiumPricing() {
  return {
    amountCents: PREMIUM_PRICE_CENTS,
    currency: PREMIUM_CURRENCY,
    interval: PREMIUM_INTERVAL,
    displayPrice: new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(PREMIUM_PRICE_CENTS / 100),
  };
}
