'use client';
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ReportDisclosure({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  return <details className="group/report-section overflow-hidden rounded-2xl border border-slate-200 bg-white" onToggle={(event) => { if (event.currentTarget.open) setOpened(true); }}>
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600 sm:p-5 [&::-webkit-details-marker]:hidden">
      <span className="min-w-0"><span className="block text-sm font-bold text-slate-900 sm:text-base">{title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-500 sm:text-sm">{description}</span></span>
      <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-open/report-section:rotate-180" />
    </summary>
    {opened && <div className="space-y-5 border-t border-slate-100 p-4 sm:p-5">{children}</div>}
  </details>;
}
