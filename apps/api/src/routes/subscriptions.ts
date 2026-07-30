import { Router } from 'express';

const router = Router();

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/mese',
    description: 'Inizia a conoscere AutoEsperto.',
    features: ['1 analisi gratuita', 'Dati base veicolo', 'Valutazione semplice', 'Pubblicità'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 5.99,
    period: '/mese',
    description: 'Per chi compra un\'auto usata con tranquillità.',
    features: ['30 analisi al mese', 'Nessuna pubblicità', 'Report completo', 'Prezzo di mercato', 'Problemi conosciuti', 'Report PDF'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    period: '/mese',
    description: 'Per appassionati e rivenditori individuali.',
    features: ['Analisi illimitate', 'AI avanzata', 'Confronto auto', 'Centro conoscenza premium', 'Previsioni valore futuro', 'Report avanzati'],
  },
];

const dealerPlans = [
  {
    id: 'dealer-base',
    name: 'Base',
    price: 99,
    period: '/mese',
    description: 'Per concessionari piccoli.',
    features: ['Profilo aziendale', 'Pubblicazione fino a 20 veicoli', 'Statistiche base'],
  },
  {
    id: 'dealer-premium',
    name: 'Premium',
    price: 199,
    period: '/mese',
    description: 'Per concessionari in crescita.',
    features: ['Pubblicazione illimitata', 'Lead prioritari', 'Statistiche avanzate', 'Pubblicità veicoli'],
  },
  {
    id: 'dealer-enterprise',
    name: 'Enterprise',
    price: 0,
    period: 'personalizzato',
    description: 'Per gruppi e reti.',
    features: ['Soluzione su misura', 'API dedicata', 'Supporto priority', 'Integrazioni'],
  },
];

router.get('/plans', (_req, res) => {
  res.json({ success: true, plans, dealerPlans });
});

router.post('/checkout', (_req, res) => {
  // Stripe mock: in produzione creare sessione Stripe.
  res.json({
    success: true,
    mode: 'test',
    message: 'Checkout Stripe simulato. Inserisci OPENAI_API_KEY e STRIPE_SECRET_KEY in .env per attivare pagamenti reali.',
    url: 'https://stripe.com/test-mode',
  });
});

export default router;
