import AdSlot from '@/components/AdSlot';

export default function AdResult({ className = '' }: { className?: string }) {
  return <AdSlot placement="result" className={`py-4 ${className}`} />;
}
