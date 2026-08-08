import AdSlot from '@/components/AdSlot';

export default function AdSidebar({ className = '' }: { className?: string }) {
  return <AdSlot placement="sidebar" className={`py-4 ${className}`} />;
}
