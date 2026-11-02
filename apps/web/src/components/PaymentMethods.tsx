import { LockKeyhole } from 'lucide-react';

const paymentOptions = [
  { name: 'Visa', src: '/images/payments/visa.svg', width: 56 },
  { name: 'Mastercard', src: '/images/payments/master.svg', width: 54 },
  { name: 'American Express', src: '/images/payments/amex.svg', width: 50 },
  { name: 'PayPal', src: '/images/payments/paypal.svg', width: 58 },
  { name: 'Apple Pay', src: '/images/payments/apple-pay.svg', width: 58 },
  { name: 'Google Pay', src: '/images/payments/google-pay.svg', width: 62 },
];

export default function PaymentMethods({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4 rounded-2xl border border-slate-200 bg-white p-5'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <LockKeyhole className="h-4 w-4 text-blue-600" aria-hidden="true" /> Checkout sicuro Stripe
        </p>
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Informazioni su Stripe">
          <img src="/images/payments/stripe.svg" alt="Powered by Stripe" width={119} height={26} className="h-6 w-auto" />
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-2" aria-label="Metodi che Stripe può offrire al checkout">
        {paymentOptions.map(({ name, src, width }) => (
          <span key={name} className="grid h-11 min-w-16 place-items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
            <img src={src} alt={name} width={width} height={28} className="h-7 max-w-16 object-contain" />
          </span>
        ))}
        <span className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-extrabold tracking-tight text-[#635bff]">Link</span>
        <span className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold tracking-tight text-slate-700">SEPA</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        Stripe mostra nel checkout i metodi attivati per l’account e compatibili con paese, dispositivo e acquisto. PayPal e gli altri metodi aggiuntivi devono essere abilitati nelle impostazioni Stripe; non sono garantiti per ogni cliente.
      </p>
    </div>
  );
}
