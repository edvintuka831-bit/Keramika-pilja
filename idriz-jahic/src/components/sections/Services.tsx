import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { SERVICES } from "../../data/services";
import ServiceArt from "../ServiceArt";
import { usePrefersReducedMotion } from "../../lib/hooks";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".svc-head > *", {
        y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".svc-head", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".svc").forEach((el) => {
        const paths = el.querySelectorAll<SVGGeometryElement>(".draw");
        paths.forEach((p) => {
          const len = p.getTotalLength ? p.getTotalLength() : 400;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 72%" } });
        tl.from(el.querySelectorAll(".svc-text > *"), { y: 36, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" })
          .from(el.querySelector(".svc-frame"), { opacity: 0, scale: 0.94, duration: 1, ease: "expo.out" }, 0)
          .to(paths, { strokeDashoffset: 0, duration: 1.6, stagger: 0.04, ease: "power2.inOut" }, 0.15)
          .from(el.querySelectorAll(".glow"), { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.5, stagger: 0.05, ease: "back.out(3)" }, 1.1);

        gsap.fromTo(el.querySelector(".svc-num"), { yPercent: 30 }, {
          yPercent: -30, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="storitve" className="relative overflow-hidden bg-ink py-24 sm:py-36">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(180deg,transparent,#000_20%,#000_80%,transparent)]" />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="svc-head mb-20 max-w-3xl sm:mb-28">
          <p className="eyebrow mb-5">Naše storitve</p>
          <h2 className="h-section">
            <span className="text-metal">Od priprave materiala</span> <span className="text-volt-glow">do končne montaže.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-2">
            Vsako delo začnemo z natančno izmero in jasnim dogovorom. Sledi skrbna izvedba – od reza in zvara do montaže na lokaciji.
          </p>
        </div>

        <div className="flex flex-col gap-24 sm:gap-36">
          {SERVICES.map((s, i) => (
            <article key={s.id} id={`storitev-${s.id}`} className="svc relative grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={`relative ${i % 2 ? "lg:order-2" : ""}`}>
                <span className="svc-num pointer-events-none absolute -top-16 left-0 font-display text-[9rem] font-bold italic leading-none text-white/[0.035] sm:text-[13rem]" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="svc-frame panel clip-tech relative aspect-[4/3] p-6 sm:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(8,123,255,0.16),transparent_65%)]" />
                  <div className="grid-lines absolute inset-0 opacity-60" />
                  <div className="relative h-full">
                    <ServiceArt art={s.art} />
                  </div>
                  <span className="absolute bottom-4 right-5 font-display text-xs uppercase tracking-[0.3em] text-steel-3">Shema</span>
                </div>
              </div>

              <div className="svc-text">
                <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-volt-2">Storitev 0{i + 1}</p>
                <h3 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase italic leading-[0.95] text-metal">{s.title}</h3>
                <p className="mt-5 text-xl font-medium leading-snug text-white">{s.lead}</p>
                <p className="mt-5 leading-relaxed text-steel-2">{s.text}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] text-steel">
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-volt-2" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      {p}
                    </li>
                  ))}
                </ul>
                <a href="#kontakt" className="group mt-8 inline-flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  Povprašajte za to storitev
                  <span className="grid h-9 w-9 place-items-center border border-volt/60 transition-colors group-hover:bg-volt">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
