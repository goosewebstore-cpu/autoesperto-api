'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle,
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  ThumbsUp,
  Wallet,
  Car,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { AdvisorMessage } from '@/lib/aiAdvisor';
import {
  getAdvisorHistory,
  saveAdvisorHistory,
  getAdvisorContext,
  generateAdvisorResponse,
} from '@/lib/aiAdvisor';
import { trackEvent } from '@/lib/analytics';

const QUICK_PROMPTS = [
  'Ho 10.000€, faccio 15.000 km e voglio un\'auto affidabile.',
  'Ho trovato una Panda a 9.900€: la compreresti o quanto dovrei offrire?',
  'Siamo in 4 in famiglia con bambini: meglio un SUV o una Station Wagon a 15.000€?',
  'Come capisco se un annuncio ha i chilometri scalati?',
];

export default function AiAdvisorPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('ask') || '';

  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<AdvisorMessage[]>(() => {
    const history = getAdvisorHistory();
    if (history.length > 0) return history;
    return [
      {
        id: 'welcome',
        sender: 'advisor',
        timestamp: new Date().toISOString(),
        text: `Ciao! Sono il tuo **AI Car Advisor** di AutoEsperto. 

Sono qui per aiutarti a comprare la tua prossima auto usata al prezzo giusto ed evitare brutte sorprese:
• Dimmi il tuo budget e come utilizzi l'auto e ti indicherò i migliori modelli.
• Incolla il link o il testo di un annuncio per sapere se conviene o quanto offrire.
• Chiedimi quali difetti controllare prima di firmare.

Di cosa hai bisogno oggi?`,
      },
    ];
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && messages.length <= 1) {
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: AdvisorMessage = {
      id: 'usr-' + Math.random().toString(36).slice(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveAdvisorHistory(newHistory);
    setInput('');
    setIsTyping(true);
    trackEvent('advisor_message_sent', { query_length: text.length });

    setTimeout(() => {
      const response = generateAdvisorResponse(text, getAdvisorContext());
      const updated = [...newHistory, response];
      setMessages(updated);
      saveAdvisorHistory(updated);
      setIsTyping(false);
    }, 600);
  };

  const handleClearHistory = () => {
    const welcome: AdvisorMessage = {
      id: 'welcome',
      sender: 'advisor',
      timestamp: new Date().toISOString(),
      text: 'Cronologia azzerata. Dimmi il tuo budget, esigenze o incolla un annuncio per ricominciare!',
    };
    setMessages([welcome]);
    saveAdvisorHistory([welcome]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white grid place-items-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                AI Car Advisor
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Attivo
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Consulente indipendente per l&apos;acquisto dell&apos;auto usata
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all text-xs flex items-center gap-1 font-semibold"
            title="Nuova conversazione"
          >
            <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Azzera chat</span>
          </button>
        </div>

        {/* Chat Window Box */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 flex flex-col overflow-hidden min-h-[460px] sm:min-h-[520px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'advisor' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white grid place-items-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* Recommended Cars Cards Grid if Present */}
                  {m.recommendedCars && m.recommendedCars.length > 0 && (
                    <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700">
                      {m.recommendedCars.map((car, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white space-y-1 text-xs"
                        >
                          <span className="font-extrabold block text-blue-600 dark:text-blue-400">
                            {car.make} {car.model}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Prezzo medio: €{car.priceAvg.toLocaleString('it-IT')}
                          </span>
                          {car.matchScore && (
                            <span className="text-[10px] font-black text-emerald-600 block">
                              Match {car.matchScore}/100
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action CTA if present */}
                  {m.actionCta && (
                    <div className="pt-2">
                      <Link
                        href={m.actionCta.href}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all"
                      >
                        {m.actionCta.label} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 grid place-items-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white grid place-items-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Sto elaborando i dati di mercato e affidabilità…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts Chips */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chiedi un consiglio o incolla il link di un annuncio da analizzare..."
              className="flex-1 h-11 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Invia</span>
            </button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
