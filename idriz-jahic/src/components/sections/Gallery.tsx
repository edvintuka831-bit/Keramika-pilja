import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, GALLERY, type GalleryItem } from "../../data/gallery";

type Props = { items?: GalleryItem[] };

export default function Gallery({ items = GALLERY }: Props) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]["id"]>("vse");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => (cat === "vse" ? items : items.filter((i) => i.category === cat)), [cat, items]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { vse: items.length };
    items.forEach((i) => { c[i.category] = (c[i.category] ?? 0) + 1; });
    return c;
  }, [items]);

  return (
    <section id="galerija" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Galerija del</p>
            <h2 className="h-section">
              <span className="text-metal">Izvedena</span> <span className="text-volt-glow">dela.</span>
            </h2>
          </div>
          {items.length > 0 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kategorije galerije">
              {CATEGORIES.filter((c) => c.id === "vse" || counts[c.id]).map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className={`relative px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${cat === c.id ? "text-white" : "text-steel-2 hover:text-white"}`}
                >
                  {cat === c.id && <motion.span layoutId="gal-tab" className="absolute inset-0 -z-0 bg-volt" style={{ clipPath: "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)" }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{c.label} <span className="text-xs opacity-60">{counts[c.id]}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((item, i) => (
                <motion.li
                  key={item.src}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={i % 5 === 0 ? "col-span-2 row-span-2 lg:col-span-1" : ""}
                >
                  <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-[4/3] w-full overflow-hidden bg-ink-3" aria-label={`Odpri fotografijo: ${item.title}`}>
                    <motion.img layoutId={`img-${item.src}`} src={item.thumb ?? item.src} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-0 left-0 p-4 text-left">
                      <span className="block font-display text-xs uppercase tracking-[0.25em] text-volt-2">{CATEGORIES.find((c) => c.id === item.category)?.label}</span>
                      <span className="block font-display text-lg font-semibold uppercase italic">{item.title}</span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <AnimatePresence>
        {open !== null && list[open] && <Lightbox list={list} index={open} setIndex={setOpen} />}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({ list, index, setIndex }: { list: GalleryItem[]; index: number; setIndex: (i: number | null) => void }) {
  const item = list[index];
  const [dir, setDir] = useState(0);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => { setDir(d); setIndex((index + d + list.length) % list.length); }, [index, list.length, setIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; prev?.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, setIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex flex-col bg-ink/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && setIndex(null)}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-steel-2">{index + 1} / {list.length}</p>
        <button ref={closeBtn} type="button" onClick={() => setIndex(null)} className="grid h-11 w-11 place-items-center border border-white/15 text-2xl hover:border-volt" aria-label="Zapri">×</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-20" onClick={(e) => e.target === e.currentTarget && setIndex(null)}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={item.src}
            layoutId={`img-${item.src}`}
            src={item.src}
            alt={item.alt}
            custom={dir}
            initial={{ opacity: 0, x: dir * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -80 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) go(info.offset.x < 0 ? 1 : -1); }}
            className="max-h-[78vh] max-w-full cursor-grab object-contain active:cursor-grabbing"
          />
        </AnimatePresence>
        {list.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/70 text-2xl hover:bg-volt sm:grid" aria-label="Prejšnja fotografija">‹</button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/70 text-2xl hover:bg-volt sm:grid" aria-label="Naslednja fotografija">›</button>
          </>
        )}
      </div>
      <p className="px-4 pb-8 pt-4 text-center font-display text-lg uppercase italic tracking-wide text-steel">{item.title}</p>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="panel clip-tech relative overflow-hidden px-6 py-16 text-center sm:py-24">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(8,123,255,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-xl">
        <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-volt-2" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="5" y="10" width="38" height="28" rx="1" />
          <circle cx="17" cy="20" r="4" />
          <path d="M5 34l11-10 8 7 6-5 13 10" />
        </svg>
        <h3 className="mt-6 font-display text-3xl font-bold uppercase italic text-metal">Fotografije bodo objavljene kmalu</h3>
        <p className="mt-4 leading-relaxed text-steel-2">
          Pripravljamo izbor fotografij izvedenih del. Za več informacij o naših storitvah nas pokličite ali nam pišite.
        </p>
        <a href="#kontakt" className="btn btn-volt mt-8">Pišite nam</a>
      </div>
    </div>
  );
}
