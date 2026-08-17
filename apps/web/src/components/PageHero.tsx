import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumb?: string;
  photo?: string;
  children?: React.ReactNode;
}

export default function PageHero({ title, subtitle, crumb, photo, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="page-hero-photo" src={photo} alt="" aria-hidden="true" loading="eager" />
      )}
      <div className="page-hero-inner">
        <Link href="/" className="page-hero-crumb">
          <Home className="h-3.5 w-3.5" /> Home
          {crumb && (
            <>
              <ChevronRight className="h-3 w-3 opacity-60" />
              {crumb}
            </>
          )}
        </Link>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
