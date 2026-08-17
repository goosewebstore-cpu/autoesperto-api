'use client';

import { useState } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';

export interface ChecklistItem {
  label: string;
  why: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { label: 'Avviamento a freddo', why: 'Un motore freddo rivela rumori o fumate che da caldo non sentiresti.' },
  { label: 'Frizione', why: 'Se scivola, strappa o è molto dura, l\'intervento è tra i più costosi.' },
  { label: 'Freni', why: 'Dischi, pastiglie e liquido: un controllo veloce evita sorprese in garanzia.' },
  { label: 'Pneumatici', why: 'Usura irregolare o gomme vecchie significano spesa immediata.' },
  { label: 'Carrozzeria', why: 'Graffi e rigonfiamenti possono nascondere un danno strutturale o un ritocco.' },
  { label: 'Perdite', why: 'Olio, acqua o liquido freni sotto l\'auto sono un campanello d\'allarme.' },
  { label: 'Spie cruscotto', why: 'Con quadro acceso tutte le spie devono accendersi e poi spegnersi.' },
  { label: 'Documentazione', why: 'Libretto, coerenza di anno e chilometri, storico della proprietà.' },
  { label: 'Tagliandi', why: 'Tagliandi regolari sono il segnale più affidabile di manutenzione rispettata.' },
  { label: 'Revisione', why: 'Verifica la prossima scadenza e che i chilometri dichiarati combacino.' },
];

interface BuyChecklistProps {
  items?: ChecklistItem[];
  title?: string;
  subtitle?: string;
}

export default function BuyChecklist({
  items = DEFAULT_ITEMS,
  title = 'Prima di comprarla, controlla queste cose',
  subtitle = 'Una checklist rapida da usare davanti all\'auto: spunta quello che hai verificato.',
}: BuyChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const progress = checked.size;

  return (
    <section className="ae-checklist" aria-label={title}>
      <div className="ae-check-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span className="ae-check-count" aria-live="polite">
          {progress}/{items.length}
        </span>
      </div>

      <div className="ae-check-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={items.length}>
        <span style={{ width: `${(progress / items.length) * 100}%` }} />
      </div>

      <ul className="ae-check-list">
        {items.map((item, index) => (
          <li key={item.label} className={`ae-check-item${checked.has(index) ? ' done' : ''}`}>
            <label className="ae-check-label">
              <input
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => toggle(index)}
                className="sr-only"
              />
              <span className="ae-check-box" aria-hidden="true">
                {checked.has(index) && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="ae-check-text">{item.label}</span>
            </label>
            <button
              type="button"
              className="ae-check-why"
              aria-expanded={open === index}
              onClick={() => setOpen(open === index ? null : index)}
            >
              Perché?
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === index ? 'rotate-180' : ''}`} />
            </button>
            {open === index && (
              <p className="ae-check-note">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {item.why}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
