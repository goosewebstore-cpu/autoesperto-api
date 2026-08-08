import AdSlot from '@/components/AdSlot';

export default function AdBanner({ className = '' }: { className?: string }) {
  return <AdSlot placement="banner" className={`py-4 ${className}`} />;
}
