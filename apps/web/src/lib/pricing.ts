const STANDARD_PRICE_CENTS = 599;
const PROMO_PRICE_CENTS = 199;
const PROMO_END_AT = '2026-08-13T21:59:59.999Z';

export function analysisOffer(now = new Date()) {
  const promotional = now.getTime() <= new Date(PROMO_END_AT).getTime();
  const amountCents = promotional ? PROMO_PRICE_CENTS : STANDARD_PRICE_CENTS;

  return {
    amountCents,
    displayPrice: new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amountCents / 100),
    promotional,
    promoEndsLabel: '13 agosto 2026',
  };
}
