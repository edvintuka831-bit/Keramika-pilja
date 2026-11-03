import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { COMPANY } from "../../lib/company";
import logo from "../../data/logo-original.webp";

const VALUES = [
  { title: "Kvaliteta", text: "Pravilno pripravljeni robovi, ustrezen postopek varjenja in čisto zaključeni zvari." },
  { title: "Natančnost", text: "Natančna izmera in pravilna geometrija, da vsak element sede na svoje mesto." },
  { title: "Zaupanje", text: "Jasen dogovor o obsegu del, rokih in ceni – brez nepotrebnih presenečenj." },
  { title: "Zanesljivost", text: "Delo opravimo tako, kot smo se dogovorili, in za izvedbo stojimo." },
];

const STEPS = [
  { title: "Povpraševanje", text: "Pokličite ali pošljite opis dela, mere in po možnosti fotografije." },
  { title: "Ogled in izmera", text: "Po potrebi si delo ogledamo na lokaciji in preverimo vse mere." },
  { title: "Ponudba", text: "Pripravimo jasno ponudbo z obsegom del in okvirnim rokom." },
  { title: "Izvedba", text: "Izdelava, varjenje in montaža – natančno in po dogovoru." },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ab-reveal", { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".ab-intro", start: "top 75%" } });
      gsap.from(".ab-logo", { rotateY: -18, rotateX: 8, opacity: 0, scale: 0.92, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".ab-logo", start: "top 80%" } });
      gsap.from(".ab-value", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".ab-values", start: "top 80%" } });
      gsap.fromTo(".ab-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".ab-steps", start: "top 75%", end: "bottom 60%", scrub: true } });
      gsap.from(".ab-step", { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".ab-steps", start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="o-nas" className="relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="ab-intro grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="ab-reveal eyebrow mb-5">O nas</p>
            <h2 className="ab-reveal h-section">
              <span className="text-metal">Moč kovine.</span><br />
              <span className="text-metal">Natančnost izvedbe.</span><br />
              <span className="text-volt-glow">Zaupanje brez kompromisov.</span>
            </h2>
            <p className="ab-reveal mt-8 text-lg leading-relaxed text-steel">
              {COMPANY.name} je mariborsko podjetje, specializirano za varjenje, kovinske konstrukcije in montažo. Opravljamo dela za zasebne naročnike in podjetja – od manjših popravil do izdelave in montaže konstrukcij.
            </p>
            <p className="ab-reveal mt-4 leading-relaxed text-steel-2">
              Pri vsakem delu sledimo istemu načelu: kovina mora biti trdno povezana, mere natančne, izvedba pa takšna, da lahko naročnik na izdelek računa dolga leta.
            </p>
          </div>

          <div className="ab-logo relative mx-auto w-full max-w-[560px] [perspective:1200px]">
            <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(8,123,255,0.28),transparent_65%)] blur-2xl" />
            <div className="clip-tech relative overflow-hidden border border-white/10 bg-black">
              <img src={logo} alt="Logotip IDRIZ JAHIĆ S.P. – varjenje in druge storitve" width={900} height={696} loading="lazy" decoding="async" className="w-full" />
            </div>
          </div>
        </div>

        <ul className="ab-values mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <li key={v.title} className="ab-value panel clip-tech group relative p-7 transition-colors duration-300 hover:border-volt/50">
              <span className="font-display text-sm font-semibold text-volt-2">0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl font-bold uppercase italic text-metal">{v.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-steel-2">{v.text}</p>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-volt transition-all duration-500 group-hover:w-full" />
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <p className="eyebrow mb-10">Potek sodelovanja</p>
          <div className="ab-steps relative">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-white/10 lg:block" />
            <div className="ab-line absolute left-0 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-volt to-volt-2 lg:block" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="ab-step relative">
                  <span className="relative z-10 grid h-10 w-10 place-items-center border border-volt bg-ink font-display font-bold text-volt-2">{i + 1}</span>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase italic">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-steel-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
