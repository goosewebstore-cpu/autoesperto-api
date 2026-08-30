export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export type GuideCategory = 'acquisto' | 'vendita' | 'valutazione' | 'manutenzione' | 'affidabilita';

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string }> = {
  acquisto: { label: 'Acquisto' },
  vendita: { label: 'Vendita' },
  valutazione: { label: 'Valutazione' },
  manutenzione: { label: 'Manutenzione' },
  affidabilita: { label: 'Affidabilità' },
};

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  category: GuideCategory;
  sections: GuideSection[];
  cta?: string;
  image?: string;
}
