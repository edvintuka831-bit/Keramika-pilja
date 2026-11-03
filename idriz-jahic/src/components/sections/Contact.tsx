import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY, MAPS_EMBED_URL, MAPS_NAV_URL, SERVICE_OPTIONS } from "../../lib/company";
import { submitInquiry, SubmitError, type InquiryData } from "../../lib/submitForm";
import { PhoneIcon } from "../Header";

type Values = Omit<InquiryData, "soglasje" | "bot-field"> & { soglasje: boolean };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Values = { ime: "", telefon: "", email: "", storitev: "", sporocilo: "", soglasje: false };
const MIN_FILL_MS = 3000;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.ime.trim().length < 2) e.ime = "Vpišite ime in priimek.";
  const digits = v.telefon.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15 || !/^[+\d\s/().-]+$/.test(v.telefon.trim())) e.telefon = "Vpišite veljavno telefonsko številko.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Vpišite veljaven e-poštni naslov.";
  if (!v.storitev) e.storitev = "Izberite storitev.";
  if (v.sporocilo.trim().length < 10) e.sporocilo = "Opišite delo (vsaj 10 znakov).";
  else if (v.sporocilo.length > 3000) e.sporocilo = "Sporočilo je predolgo (največ 3000 znakov).";
  if (!v.soglasje) e.soglasje = "Za obdelavo povpraševanja potrebujemo vaše soglasje.";
  return e;
}

export default function Contact() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mapOn, setMapOn] = useState(false);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...values, [k]: val };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate(values);
    setErrors(errs);
    setTouched({ ime: true, telefon: true, email: true, storitev: true, sporocilo: true, soglasje: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // zaščita pred roboti: skrito polje in prehitro izpolnjen obrazec
    if (honeypot.current?.value || Date.now() - startedAt.current < MIN_FILL_MS) {
      setStatus("error");
      setErrorMsg("Obrazec je bil oddan prehitro. Počakajte nekaj sekund in poskusite znova.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitInquiry({
        ime: values.ime.trim(),
        telefon: values.telefon.trim(),
        email: values.email.trim(),
        storitev: values.storitev,
        sporocilo: values.sporocilo.trim(),
        soglasje: "da",
        "bot-field": "",
      });
      setStatus("sent");
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof SubmitError ? err.message : "Prišlo je do napake.");
    }
  }

  const fieldProps = (k: keyof Values) => ({
    id: `f-${k}`,
    name: k,
    "aria-invalid": touched[k] && errors[k] ? true : undefined,
    "aria-describedby": touched[k] && errors[k] ? `e-${k}` : undefined,
    onBlur: () => blur(k),
  });
  const Err = ({ k }: { k: keyof Values }) =>
    touched[k] && errors[k] ? <p id={`e-${k}`} className="mt-1.5 text-sm text-red-400">{errors[k]}</p> : null;

  return (
    <section id="kontakt" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-volt/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <p className="eyebrow mb-5">Kontakt</p>
          <h2 className="h-section">
            <span className="text-metal">Pošljite</span> <span className="text-volt-glow">povpraševanje.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-steel-2">
            Opišite, kaj potrebujete. Odgovorili vam bomo v najkrajšem možnem času. Za hitrejši dogovor nas lahko tudi pokličete.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
          {/* kontaktni podatki */}
          <div className="flex flex-col gap-4">
            <ContactCard href={COMPANY.phoneHref} label="Telefon" value={COMPANY.phoneDisplay} icon={<PhoneIcon className="h-5 w-5" />} />
            <ContactCard
              href={COMPANY.emailHref}
              label="E-pošta"
              value={COMPANY.email}
              icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 7 9 6 9-6" /></svg>}
            />
            <ContactCard
              href={MAPS_NAV_URL}
              external
              label="Naslov · navigacija"
              value={`${COMPANY.street}, ${COMPANY.city}`}
              icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>}
            />

            {/* zemljevid se naloži šele po kliku (Google nastavi piškotke) */}
            <div className="panel clip-tech relative mt-2 aspect-[4/3] overflow-hidden lg:aspect-auto lg:flex-1">
              {mapOn ? (
                <iframe
                  title={`Zemljevid: ${COMPANY.mapsQuery}`}
                  src={MAPS_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.7)]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="grid-lines absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <p className="max-w-sm text-sm leading-relaxed text-steel-2">
                    Zemljevid prikazuje Google Maps. Ob nalaganju lahko Google shrani piškotke in obdeluje vaše podatke.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => setMapOn(true)} className="btn btn-volt !px-5 !py-3 text-sm">Prikaži zemljevid</button>
                    <a href={MAPS_NAV_URL} target="_blank" rel="noopener noreferrer" className="btn btn-steel !px-5 !py-3 text-sm">Odpri navigacijo</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* obrazec */}
          <div className="panel clip-tech relative p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[460px] flex-col items-center justify-center text-center" role="status">
                  <span className="grid h-16 w-16 place-items-center bg-volt">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <h3 className="mt-6 font-display text-3xl font-bold uppercase italic text-metal">Povpraševanje je poslano</h3>
                  <p className="mt-3 max-w-md text-steel-2">Hvala. Vaše sporočilo smo prejeli in se vam bomo oglasili v najkrajšem možnem času.</p>
                  <button type="button" onClick={() => { setStatus("idle"); startedAt.current = Date.now(); }} className="mt-8 font-display text-sm uppercase tracking-[0.2em] text-volt-2 hover:text-white">
                    Pošlji novo povpraševanje
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" ref={formRef} onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5" aria-label="Obrazec za povpraševanje">
                  {/* skrito polje za robote */}
                  <p className="hidden" aria-hidden="true">
                    <label>Ne izpolnjujte: <input ref={honeypot} name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="f-ime">Ime in priimek</Label>
                      <input {...fieldProps("ime")} className="field" autoComplete="name" value={values.ime} onChange={(e) => set("ime", e.target.value)} maxLength={120} />
                      <Err k="ime" />
                    </div>
                    <div>
                      <Label htmlFor="f-telefon">Telefon</Label>
                      <input {...fieldProps("telefon")} type="tel" inputMode="tel" className="field" autoComplete="tel" value={values.telefon} onChange={(e) => set("telefon", e.target.value)} maxLength={30} placeholder="npr. 041 123 456" />
                      <Err k="telefon" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="f-email">E-pošta</Label>
                      <input {...fieldProps("email")} type="email" inputMode="email" className="field" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} maxLength={160} />
                      <Err k="email" />
                    </div>
                    <div>
                      <Label htmlFor="f-storitev">Storitev</Label>
                      <select {...fieldProps("storitev")} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234aa3ff%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10" value={values.storitev} onChange={(e) => set("storitev", e.target.value)}>
                        <option value="" className="bg-ink">Izberite storitev …</option>
                        {SERVICE_OPTIONS.map((s) => <option key={s} value={s} className="bg-ink">{s}</option>)}
                      </select>
                      <Err k="storitev" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="f-sporocilo">Sporočilo</Label>
                    <textarea {...fieldProps("sporocilo")} rows={6} className="field resize-y" value={values.sporocilo} onChange={(e) => set("sporocilo", e.target.value)} maxLength={3000} placeholder="Opišite delo, material, mere in lokacijo …" />
                    <Err k="sporocilo" />
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-steel-2">
                      <input
                        type="checkbox"
                        name="soglasje"
                        checked={values.soglasje}
                        onChange={(e) => { set("soglasje", e.target.checked); setTouched((t) => ({ ...t, soglasje: true })); setErrors(validate({ ...values, soglasje: e.target.checked })); }}
                        aria-invalid={touched.soglasje && errors.soglasje ? true : undefined}
                        aria-describedby={touched.soglasje && errors.soglasje ? "e-soglasje" : undefined}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#087BFF]"
                      />
                      <span>
                        Strinjam se, da {COMPANY.name} moje podatke obdela za namen odgovora na povpraševanje, kot je opisano v{" "}
                        <Link to="/zasebnost" className="text-volt-2 underline underline-offset-2 hover:text-white">politiki zasebnosti</Link>.
                      </span>
                    </label>
                    <Err k="soglasje" />
                  </div>

                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
                        <strong className="block">Sporočilo ni bilo poslano.</strong>
                        {errorMsg} Lahko nas tudi pokličete na <a href={COMPANY.phoneHref} className="underline">{COMPANY.phoneDisplay}</a> ali pišete na <a href={COMPANY.emailHref} className="underline">{COMPANY.email}</a>.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={status === "sending"} className="btn btn-volt mt-1 w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:justify-self-start">
                    {status === "sending" ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Pošiljanje …</>
                    ) : (
                      <>Pošlji povpraševanje <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-steel">
      {children} <span className="text-volt-2" aria-hidden="true">*</span>
    </label>
  );
}

function ContactCard({ href, label, value, icon, external }: { href: string; label: string; value: string; icon: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="panel clip-tech group flex items-center gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-volt/60"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center bg-volt/15 text-volt-2 transition-colors group-hover:bg-volt group-hover:text-white">{icon}</span>
      <span className="min-w-0">
        <span className="block font-display text-xs font-semibold uppercase tracking-[0.25em] text-steel-2">{label}</span>
        <span className="block truncate text-lg font-semibold text-white">{value}</span>
      </span>
      <svg viewBox="0 0 24 24" className="ml-auto h-5 w-5 shrink-0 text-steel-3 transition-all group-hover:translate-x-1 group-hover:text-volt-2" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
  );
}
