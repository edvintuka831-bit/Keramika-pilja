import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "../../lib/gsap";
import { supportsWebGL, useInView, usePrefersReducedMotion } from "../../lib/hooks";
import { COMPANY } from "../../lib/company";

const HeroCanvas = lazy(() => import("../../three/HeroCanvas"));

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ ready }: { ready: boolean }) {
  const [sectionRef, inView] = useInView<HTMLElement>("0px");
  const content = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const webgl = useRef(supportsWebGL()).current;

  // tekst se ob drsenju umakne navzgor in zbledi
  useLayoutEffect(() => {
    if (reduced || !content.current) return;
    const ctx = gsap.context(() => {
      gsap.to(content.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [reduced, sectionRef]);

  const show = ready ? "show" : "hide";
  const item = {
    hide: { opacity: 0, y: 40 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: 0.15 + i * 0.12 } }),
  };

  return (
    <section ref={sectionRef} id="domov" className="noise relative flex min-h-[100svh] items-end overflow-hidden bg-ink pb-16 pt-32 sm:items-center sm:pb-24" aria-label="Uvod">
      {/* 3D scena varjenja */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(8,123,255,0.22),transparent_60%)]" />
        {webgl && ready && (
          <Suspense fallback={null}>
            <HeroCanvas active={inView} />
          </Suspense>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.92)_0%,rgba(5,7,11,0.65)_38%,rgba(5,7,11,0)_70%)] max-sm:bg-[linear-gradient(0deg,rgba(5,7,11,0.96)_25%,rgba(5,7,11,0.35)_70%,rgba(5,7,11,0.5)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div ref={content} className="relative z-10 mx-auto w-full max-w-[1320px] px-4 sm:px-8">
        <motion.p className="eyebrow mb-6" variants={item} initial="hide" animate={show} custom={0}>
          {COMPANY.activity} · Maribor
        </motion.p>
        <h1 className="max-w-[13ch] font-display text-[clamp(3rem,8.4vw,7.6rem)] font-bold uppercase italic leading-[0.88] tracking-tight">
          <motion.span className="block text-metal" variants={item} initial="hide" animate={show} custom={1}>Preciznost,</motion.span>
          <motion.span className="block text-metal" variants={item} initial="hide" animate={show} custom={2}>ki povezuje</motion.span>
          <motion.span className="block text-volt-glow" variants={item} initial="hide" animate={show} custom={3}>kovino.</motion.span>
        </h1>
        <motion.p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-steel sm:text-xl" variants={item} initial="hide" animate={show} custom={4}>
          Profesionalne storitve varjenja, kovinskih konstrukcij in montaže.
        </motion.p>
        <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" variants={item} initial="hide" animate={show} custom={5}>
          <a href="#storitve" className="btn btn-volt">
            Naše storitve
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a href="#kontakt" className="btn btn-steel">Pošljite povpraševanje</a>
        </motion.div>

        <motion.ul className="mt-14 hidden max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-6 sm:grid" variants={item} initial="hide" animate={show} custom={6}>
          {["Kvaliteta", "Natančnost", "Zaupanje"].map((w, i) => (
            <li key={w} className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-steel-2">
              <span className="mr-2 text-volt-2">0{i + 1}</span>{w}
            </li>
          ))}
        </motion.ul>
      </div>

      <a href="#storitve" className="absolute bottom-6 right-6 z-10 hidden flex-col items-center gap-3 font-display text-[11px] uppercase tracking-[0.3em] text-steel-2 sm:flex" aria-label="Pomaknite se navzdol">
        <span className="[writing-mode:vertical-rl]">Drsite</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/20">
          <span className="absolute inset-x-0 top-0 h-6 animate-[drop_2s_ease-in-out_infinite] bg-volt-2" />
        </span>
      </a>
    </section>
  );
}
