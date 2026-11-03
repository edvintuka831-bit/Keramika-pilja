import { COMPANY } from "../lib/company";
import { usePageMeta } from "../lib/hooks";

const UPDATED = "3. 11. 2026";

export default function Privacy() {
  usePageMeta("Politika zasebnosti | IDRIZ JAHIĆ S.P.", "Politika zasebnosti in obdelava osebnih podatkov na spletni strani IDRIZ JAHIĆ S.P.");
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-36 sm:px-8">
      <p className="eyebrow mb-5">Pravne informacije</p>
      <h1 className="h-section text-metal">Politika zasebnosti</h1>
      <p className="mt-4 text-sm text-steel-3">Zadnja posodobitev: {UPDATED}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-steel [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:italic [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_a]:text-volt-2 [&_a]:underline">
        <section>
          <h2>1. Upravljavec osebnih podatkov</h2>
          <p>
            {COMPANY.name}, {COMPANY.street}, {COMPANY.city}, {COMPANY.country}<br />
            E-pošta: <a href={COMPANY.emailHref}>{COMPANY.email}</a>, telefon: <a href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>
          </p>
        </section>

        <section>
          <h2>2. Katere podatke obdelujemo</h2>
          <p>Ko izpolnite obrazec za povpraševanje, obdelujemo podatke, ki jih vpišete sami:</p>
          <ul className="mt-2 space-y-1">
            <li>ime in priimek,</li>
            <li>telefonska številka,</li>
            <li>e-poštni naslov,</li>
            <li>izbrana storitev in vsebina sporočila.</li>
          </ul>
          <p className="mt-3">Ob oddaji obrazca ponudnik gostovanja zaradi zaščite pred zlorabami in neželeno pošto samodejno obdela tudi tehnične podatke (npr. IP-naslov in čas oddaje).</p>
        </section>

        <section>
          <h2>3. Namen in pravna podlaga</h2>
          <p>
            Podatke obdelujemo izključno za odgovor na vaše povpraševanje, pripravo ponudbe in dogovor o izvedbi del. Pravna podlaga je vaša privolitev (točka (a) prvega odstavka 6. člena Splošne uredbe o varstvu podatkov – GDPR) ter izvajanje ukrepov pred sklenitvijo pogodbe na vašo zahtevo (točka (b) prvega odstavka 6. člena GDPR).
          </p>
          <p className="mt-3">Podatkov ne uporabljamo za oglaševanje in jih ne prodajamo ali posredujemo tretjim osebam za njihove namene.</p>
        </section>

        <section>
          <h2>4. Obdelovalci in prenos podatkov</h2>
          <p>Za delovanje spletne strani in obrazca uporabljamo naslednje ponudnike, ki podatke obdelujejo v našem imenu:</p>
          <ul className="mt-2 space-y-1">
            <li><strong className="text-white">Netlify, Inc.</strong> (ZDA) – gostovanje spletne strani ter sprejem in hramba sporočil iz obrazca,</li>
            <li><strong className="text-white">Google LLC</strong> (ZDA) – e-poštni predal, v katerega prejemamo obvestila o povpraševanjih.</li>
          </ul>
          <p className="mt-3">Prenos podatkov v ZDA poteka na podlagi okvira EU-ZDA za zasebnost podatkov oziroma standardnih pogodbenih klavzul Evropske komisije.</p>
        </section>

        <section>
          <h2>5. Rok hrambe</h2>
          <p>
            Podatke iz povpraševanja hranimo, dokler je to potrebno za odgovor in dogovor o delu, najdlje 12 mesecev od zadnjega stika. Če sklenemo pogodbo, podatke iz računov in pogodbene dokumentacije hranimo toliko časa, kot to zahtevajo predpisi.
          </p>
        </section>

        <section>
          <h2>6. Piškotki in zunanje vsebine</h2>
          <p>
            Spletna stran ne uporablja piškotkov za analitiko, oglaševanje ali sledenje, zato soglasje za piškotke ni potrebno. Pisave so naložene z našega strežnika. V shrambi brskalnika (sessionStorage) shranimo le podatek, da ste uvodno animacijo že videli, ta podatek pa se izbriše, ko zaprete brskalnik.
          </p>
          <p className="mt-3">
            Zemljevid Google Maps se naloži šele, ko kliknete gumb »Prikaži zemljevid«. Takrat Google LLC lahko obdeluje vaše podatke in shrani piškotke v skladu s svojo <a href="https://policies.google.com/privacy?hl=sl" target="_blank" rel="noopener noreferrer">politiko zasebnosti</a>.
          </p>
        </section>

        <section>
          <h2>7. Vaše pravice</h2>
          <p>Imate pravico do dostopa do svojih podatkov, popravka, izbrisa, omejitve obdelave, ugovora obdelavi in prenosljivosti podatkov. Privolitev lahko kadar koli prekličete, kar ne vpliva na zakonitost obdelave pred preklicem. Zahtevo pošljite na <a href={COMPANY.emailHref}>{COMPANY.email}</a>.</p>
          <p className="mt-3">
            Če menite, da obdelava vaših podatkov ni zakonita, lahko vložite pritožbo pri Informacijskem pooblaščencu Republike Slovenije, Dunajska cesta 22, 1000 Ljubljana, <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer">www.ip-rs.si</a>.
          </p>
        </section>

        <section>
          <h2>8. Varnost</h2>
          <p>Spletna stran deluje prek šifrirane povezave HTTPS. Do sporočil iz obrazca ima dostop le upravljavec.</p>
        </section>
      </div>
    </article>
  );
}
