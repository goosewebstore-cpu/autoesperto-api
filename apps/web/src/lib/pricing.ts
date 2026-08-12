export const PREMIUM_PRICE_CENTS_MONTHLY = 499; // 4,99 €/mese
export const PREMIUM_PRICE_CENTS_ANNUAL = 4190;  // 41,90 €/anno (sconto 30%)
export const PREMIUM_CURRENCY = 'eur';

export function getPremiumPricing(interval: 'month' | 'year' = 'month') {
  const isAnnual = interval === 'year';
  const price = isAnnual ? PREMIUM_PRICE_CENTS_ANNUAL : PREMIUM_PRICE_CENTS_MONTHLY;
  return {
    amountCents: price,
    currency: PREMIUM_CURRENCY,
    interval: interval,
    displayPrice: new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price / 100),
    monthlyEquivalent: isAnnual ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format((price / 12) / 100) : null,
    discountPercentage: isAnnual ? 30 : 0,
  };
}

