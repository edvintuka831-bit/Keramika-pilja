import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { COMPANY, MAPS_NAV_URL } from "../lib/company";
import { SERVICES } from "../data/services";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#030408] pb-24 pt-20 lg:pb-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-volt to-transparent opacity-60" />
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm font-display text-lg font-semibold uppercase italic leading-snug tracking-wide text-steel">
            {COMPANY.slogan}
          </p>
        </div>
        <div>
          <h2 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.3em] text-volt-2">Storitve</h2>
          <ul className="grid gap-2.5 text-[15px] text-steel-2">
            {SERVICES.map((s) => (
              <li key={s.id}><a href={`/#storitev-${s.id}`} className="transition-colors hover:text-white">{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.3em] text-volt-2">Kontakt</h2>
          <address className="grid gap-2.5 text-[15px] not-italic text-steel-2">
            <a href={COMPANY.phoneHref} className="transition-colors hover:text-white">{COMPANY.phoneDisplay}</a>
            <a href={COMPANY.emailHref} className="break-all transition-colors hover:text-white">{COMPANY.email}</a>
            <a href={MAPS_NAV_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              {COMPANY.street}<br />{COMPANY.city}, {COMPANY.country}
            </a>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1320px] flex-col gap-3 border-t border-white/[0.06] px-4 pt-8 text-sm text-steel-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {COMPANY.name} Vse pravice pridržane.</p>
        <Link to="/zasebnost" className="transition-colors hover:text-white">Politika zasebnosti</Link>
      </div>
    </footer>
  );
}

/** Spodnja vrstica z gumboma za klic in e-pošto na mobilnih napravah. */
export function MobileContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-ink/90 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <a href={COMPANY.phoneHref} className="flex items-center justify-center gap-2 bg-volt py-4 font-display text-sm font-semibold uppercase tracking-[0.18em]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
        Pokličite
      </a>
      <a href="/#kontakt" className="flex items-center justify-center gap-2 py-4 font-display text-sm font-semibold uppercase tracking-[0.18em] text-steel">
        Povpraševanje
      </a>
    </div>
  );
}
