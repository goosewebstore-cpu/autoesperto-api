interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  const renderText = (text: string) => text.split(/(goosewebstore@gmail\.com)/g).map((part, index) =>
    part === 'goosewebstore@gmail.com'
      ? <a key={`${part}-${index}`} href="mailto:goosewebstore@gmail.com" className="font-semibold text-accent hover:underline">{part}</a>
      : part
  );

  return (
    <main className="max-w-3xl mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{title}</h1>
        <p className="text-sm text-text-tertiary mt-2">Ultimo aggiornamento: {updated}</p>
      </div>
      <p className="text-text-secondary leading-relaxed mb-8">{renderText(intro)}</p>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold text-text-primary mb-2">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2">
                {renderText(p)}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
