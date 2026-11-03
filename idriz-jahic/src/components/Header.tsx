import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { COMPANY } from "../lib/company";

const NAV = [
  { href: "/#storitve", label: "Storitve" },
  { href: "/#konstrukcija", label: "3D konstrukcija" },
  { href: "/#galerija", label: "Galerija" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // označi trenutno sekcijo v meniju
  useEffect(() => {
    if (pathname !== "/") { setActive(""); return; }
    const ids = NAV.map((n) => n.href.split("#")[1]);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const t = setTimeout(() => ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); }), 300);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-white/[0.06] bg-ink/85 py-2 backdrop-blur-xl" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8">
        <Link to="/" aria-label="IDRIZ JAHIĆ S.P. – domov" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Glavni meni" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => {
            const isActive = active === n.href.split("#")[1];
            return (
              <a
                key={n.href}
                href={n.href}
                className={`group relative font-display text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors ${isActive ? "text-white" : "text-steel-2 hover:text-white"}`}
              >
                {n.label}
                <span className={`absolute -bottom-1.5 left-0 h-[2px] bg-volt transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a href={COMPANY.phoneHref} className="btn btn-volt hidden !px-5 !py-3 text-[14px] sm:inline-flex">
            <PhoneIcon /> {COMPANY.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative grid h-11 w-11 place-items-center border border-white/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobilni-meni"
            aria-label={open ? "Zapri meni" : "Odpri meni"}
          >
            <span className={`absolute h-[2px] w-5 bg-white transition-all duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-[2px] w-5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute h-[2px] w-5 bg-white transition-all duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

    </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobilni-meni"
            aria-label="Mobilni meni"
            className="grid-lines fixed inset-0 z-[45] flex flex-col justify-between bg-ink px-6 pb-10 pt-24 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {NAV.map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.5 }}>
                  <a href={n.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-white/[0.06] py-3 font-display text-4xl font-bold uppercase italic">
                    <span className="text-sm not-italic text-volt-2">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a href={COMPANY.phoneHref} className="btn btn-volt w-full"><PhoneIcon /> {COMPANY.phoneDisplay}</a>
              <a href={COMPANY.emailHref} className="text-center text-sm text-steel-2">{COMPANY.email}</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
