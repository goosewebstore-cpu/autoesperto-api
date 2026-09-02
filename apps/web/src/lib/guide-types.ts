export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export type GuideCategory = 'acquisto' | 'vendita' | 'valutazione' | 'manutenzione' | 'affidabilita';

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string; description?: string }> = {
  acquisto: { label: 'Acquisto', description: 'Consigli, verifiche e guide per scegliere la tua auto ideale' },
  vendita: { label: 'Vendita', description: 'Come valorizzare e vendere la tua auto al miglior prezzo' },
  valutazione: { label: 'Valutazione', description: 'Analisi svalutazione, quotazioni e calcolo IPT' },
  manutenzione: { label: 'Manutenzione', description: 'Guida tecnica ai guasti, ricambi e manutenzione ordinaria' },
  affidabilita: { label: 'Affidabilità', description: 'Report motori, cambi e difetti noti per modello' },
};

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  category: GuideCategory;
  sections?: GuideSection[];
  content?: string;
  cta?: string;
  ctaType?: 'valutazione-auto' | 'passaporto-digitale' | 'analizza-annuncio' | 'calcolo-bollo' | 'car-finder';
  image?: string;
  readTime?: string;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
}
