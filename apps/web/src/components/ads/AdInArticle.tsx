import AdSlot from '@/components/AdSlot';

export default function AdInArticle({ className = '' }: { className?: string }) {
  return <AdSlot placement="in_article" className={`py-3 ${className}`} />;
}
