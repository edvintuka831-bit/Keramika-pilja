# IDRIZ JAHIĆ S.P. – web stranica

Produkcijska web stranica za slovensku firmu **IDRIZ JAHIĆ S.P.** (varjenje in druge storitve, Maribor).
Jezik stranice: slovenski.

**Tehnologija:** React 19 + TypeScript + Vite · Three.js + React Three Fiber (+ drei) · Framer Motion · GSAP ScrollTrigger · Tailwind CSS 4 · Netlify (hosting i forme)

## Pokretanje

```bash
npm install
npm run dev        # razvoj: http://localhost:5173
npm run build      # provjera tipova + production build u dist/
npm run preview    # pregled builda: http://localhost:4173
```

Potreban je Node.js 20+ (Netlify koristi Node 22, podešeno u `netlify.toml`).

## Struktura

```
index.html                 SEO meta oznake, Open Graph, JSON-LD (LocalBusiness)
netlify.toml               build, SPA preusmjeravanje, sigurnosna zaglavlja (CSP, HSTS), keširanje
vite.config.ts             build + automatsko generisanje robots.txt i sitemap.xml
public/
  __forms.html             statična definicija forme za Netlify Forms
  og-image.jpg, icon-512.png, apple-touch-icon.png, favicon.svg, site.webmanifest
  gallery/                 ovdje idu stvarne fotografije radova
src/
  App.tsx                  rute (/, /zasebnost, 404) i intro (samo jednom po sesiji)
  components/Intro.tsx     cinematic 3D intro (IJ monogram, odsjaj, varnice, naziv firme)
  components/sections/     Hero, Services, Structure3D, Gallery, About, Contact
  three/                   3D scene: monogram, scena varenja, čelična hala, varnice, materijali
  data/                    tekstovi usluga, dijelovi 3D modela, galerija, originalni logotip
  lib/                     podaci firme, slanje forme, pomoćne funkcije
  pages/Privacy.tsx        politika privatnosti (GDPR)
```

## Objava na Netlify

1. Na https://app.netlify.com → **Add new site → Import an existing project** → odaberite GitHub repozitorij.
2. Ako je projekt u podmapi repozitorija (trenutno `idriz-jahic/`), postavite **Base directory: `idriz-jahic`**.
   Build command (`npm run build`) i publish directory (`dist`) čitaju se iz `netlify.toml`.
3. **Deploy.** Netlify automatski uključuje HTTPS (Let's Encrypt).

### Kontakt forma (Netlify Forms) – obavezno podesiti

Forma šalje upite na Netlify Forms (obrada na serveru, honeypot polje, Netlifyjev filter spama i provjera vremena popunjavanja na stranici).

1. **Site configuration → Forms → Enable form detection**, zatim pokrenite novi deploy (**Deploys → Trigger deploy**).
   Nakon toga se forma `povprasevanje` pojavljuje u listi formi.
2. **Forms → Form notifications → Add notification → Email notification** → `idrizjahic95@gmail.com`.
3. **Testirajte prije predstavljanja klijentu:** pošaljite probni upit na objavljenoj stranici i provjerite
   da se pojavio u Netlify → Forms i da je stigao e-mail. Probni upis zatim obrišite.

Važno: slanje forme uključeno je samo u buildu na Netlifyju (`NETLIFY=true`). Lokalno ili na drugom hostingu
forma namjerno javlja grešku i nudi telefon/e-mail, kako posjetilac nikad ne bi vidio lažnu potvrdu o slanju.
Potvrda „Povpraševanje je poslano“ prikazuje se samo kad server prihvati upit.

## Povezivanje vlastite domene

1. Netlify → **Domain management → Add a domain** → upišite domenu (npr. `www.idrizjahic.si`).
2. Kod registra domene (za `.si` domene npr. kod vašeg registrara) postavite DNS:
   - **Preporučeno:** promijenite nameservere na Netlify DNS (Netlify ih prikaže u koraku 1), ili
   - `www` → **CNAME** na `<ime-sajta>.netlify.app`, a korijenska domena → **A zapis** na adresu koju prikaže Netlify.
3. Kada DNS proradi, u **HTTPS** odjeljku potvrdite certifikat (Let's Encrypt, besplatno, automatski se obnavlja).
4. Postavite primarnu domenu (npr. `www.idrizjahic.si`) – druga varijanta se automatski preusmjerava.
5. **Ponovo deployajte** stranicu: canonical oznaka, Open Graph adrese, `sitemap.xml` i `robots.txt` automatski koriste
   primarni URL sajta (Netlify varijabla `URL`). Za drugi hosting postavite varijablu `SITE_URL` (vidi `.env.example`).
6. Dodajte stranicu u **Google Search Console** i predajte `https://vasa-domena/sitemap.xml`.

## Galerija – dodavanje stvarnih fotografija

1. Fotografije (JPG/WebP, širina 1600–2000 px, do ~400 KB) kopirajte u `public/gallery/`.
2. Upišite ih u `src/data/gallery.ts` (putanja, naslov, kategorija, opis).
3. Commit + push → Netlify automatski objavljuje.

Dok je lista prazna, galerija prikazuje obavijest da će fotografije biti objavljene uskoro.
Dodajte samo fotografije radova koje je firma stvarno izvela.

## Privatnost i kolačići

- Stranica ne koristi analitiku, reklamne ni pratilačke kolačiće, pa banner za kolačiće nije potreban.
- Fontovi su na vlastitom serveru (bez Google Fonts).
- Google Maps se učitava tek nakon klika na „Prikaži zemljevid“ (uz obavijest); dugme za navigaciju otvara Google Maps u novom prozoru.
- U `sessionStorage` se pamti samo da je intro već odgledan.
- Ako kasnije dodate analitiku (npr. Google Analytics), potrebno je dodati banner za pristanak i dopuniti politiku privatnosti.

## Prije predstavljanja klijentu

- [ ] Vlasnik potvrđuje tekstove usluga i sekcije „O nas“ (`src/data/services.ts`, `src/components/sections/About.tsx`).
- [ ] Vlasnik pregleda politiku privatnosti (`src/pages/Privacy.tsx`).
- [ ] Dodati matični i porezni broj (matična in davčna številka) firme u footer i politiku privatnosti, ako ih vlasnik želi objaviti.
- [ ] Netlify Forms: detekcija uključena, e-mail obavijest postavljena, probni upit poslan i primljen.
- [ ] Vlastita domena povezana i HTTPS aktivan.
- [ ] Dodane stvarne fotografije radova.

## Napomene o sadržaju

- Logotip: korištena je originalna slika logotipa koju je dostavio klijent (`src/data/logo-original.webp`, OG slika i ikone).
  IJ monogram u 3D-u i SVG verziji izrađen je prema tom logotipu.
- 3D model čelične hale je prikazni model tipske konstrukcije, a ne konkretan izvedeni projekat (tako je i označen na stranici).
- Na stranici nema izmišljenih recenzija, certifikata, referenci ni brojki.
