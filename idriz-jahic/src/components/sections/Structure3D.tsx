import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PARTS, type PartId } from "../../data/structureParts";
import { supportsWebGL, useInView } from "../../lib/hooks";

const StructureCanvas = lazy(() => import("../../three/StructureCanvas"));

export default function Structure3D() {
  // scena se naloži šele, ko se uporabnik približa sekciji
  const [wrapRef, near] = useInView<HTMLDivElement>("600px 0px", true);
  const [viewRef, visible] = useInView<HTMLDivElement>("0px");
  const [selected, setSelected] = useState<PartId | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [webgl] = useState(supportsWebGL);
  const part = PARTS.find((p) => p.id === selected);
  const index = part ? PARTS.indexOf(part) : -1;

  return (
    <section id="konstrukcija" className="relative overflow-hidden border-y border-white/[0.06] bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">3D prikaz</p>
            <h2 className="h-section">
              <span className="text-metal">Raziščite</span> <span className="text-volt-glow">jekleno konstrukcijo.</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-steel-2">
            Model tipske jeklene hale prikazuje ključne dele, ki jih izdelujemo, varimo in montiramo. Model zavrtite, povečajte in kliknite označene točke za opis posameznega dela.
          </p>
        </div>

        <div ref={wrapRef} className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div ref={viewRef} className="panel clip-tech relative h-[62vh] min-h-[420px] overflow-hidden sm:h-[640px]">
            {webgl && near ? (
              <Suspense fallback={<Loader />}>
                <StructureCanvas active={visible} selected={selected} onSelect={setSelected} resetKey={resetKey} />
              </Suspense>
            ) : (
              <Loader text={webgl ? undefined : "Vaš brskalnik ne podpira 3D prikaza (WebGL)."} />
            )}

            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 font-display text-[11px] uppercase tracking-[0.2em] text-steel-2">
              <span className="border border-white/10 bg-ink/70 px-2.5 py-1 backdrop-blur">Vrtenje: povleci</span>
              <span className="border border-white/10 bg-ink/70 px-2.5 py-1 backdrop-blur">Povečava: kolešček / dva prsta</span>
            </div>
            <button
              type="button"
              onClick={() => { setSelected(null); setResetKey((k) => k + 1); }}
              className="absolute bottom-4 right-4 border border-white/15 bg-ink/80 px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel backdrop-blur transition-colors hover:border-volt hover:text-white"
            >
              Ponastavi pogled
            </button>
            <span className="pointer-events-none absolute bottom-5 left-4 font-display text-[11px] uppercase tracking-[0.2em] text-steel-3">Prikazni model · ni konkreten projekt</span>
          </div>

          <aside className="flex flex-col gap-5" aria-label="Deli konstrukcije">
            <div className="panel clip-tech min-h-[220px] p-6" aria-live="polite">
              <AnimatePresence mode="wait">
                {part ? (
                  <motion.div key={part.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-volt-2">Del {index + 1}</p>
                    <h3 className="mt-2 font-display text-3xl font-bold uppercase italic text-metal">{part.name}</h3>
                    <p className="mt-1 text-sm font-medium text-steel">{part.spec}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-steel-2">{part.text}</p>
                  </motion.div>
                ) : (
                  <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-volt-2">Izberite del</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-steel-2">
                      Kliknite številko na modelu ali izberite del s seznama. Kamera se bo približala in izbrani del bo označen modro.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {PARTS.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(selected === p.id ? null : p.id)}
                    aria-pressed={selected === p.id}
                    className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                      selected === p.id ? "border-volt bg-volt/15 text-white" : "border-white/[0.07] bg-white/[0.02] text-steel-2 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-xs font-bold ${selected === p.id ? "bg-volt text-white" : "border border-volt-2/60 text-volt-2"}`}>{i + 1}</span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Loader({ text }: { text?: string }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex flex-col items-center gap-4 text-center">
        {!text && <span className="h-10 w-10 animate-spin rounded-full border-2 border-volt/30 border-t-volt" />}
        <p className="max-w-xs px-4 font-display text-sm uppercase tracking-[0.25em] text-steel-2">{text ?? "Nalaganje 3D modela …"}</p>
      </div>
    </div>
  );
}
