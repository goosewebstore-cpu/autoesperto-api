export const PREMIUM_PRICE_CENTS_MONTHLY = 499; // 4,99 €/mese
export const PREMIUM_PRICE_CENTS_ANNUAL = 4190;  // 41,90 €/anno (sconto 30%)
export const PREMIUM_CURRENCY = 'eur';
export const REPORT_PRICE_CENTS = 399; // 3,99 €/report singolo

const eurFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

export function getReportPricing() {
  return {
    amountCents: REPORT_PRICE_CENTS,
    currency: PREMIUM_CURRENCY,
    displayPrice: eurFormatter.format(REPORT_PRICE_CENTS / 100),
  };
}

export function getPremiumPricing(interval: 'month' | 'year' = 'month') {
  const isAnnual = interval === 'year';
  const price = isAnnual ? PREMIUM_PRICE_CENTS_ANNUAL : PREMIUM_PRICE_CENTS_MONTHLY;
  return {
    amountCents: price,
    currency: PREMIUM_CURRENCY,
    interval: interval,
    displayPrice: eurFormatter.format(price / 100),
    monthlyEquivalent: isAnnual ? eurFormatter.format((price / 12) / 100) : null,
    discountPercentage: isAnnual ? 30 : 0,
  };
}

