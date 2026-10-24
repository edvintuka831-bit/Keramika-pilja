# Keramika Pilja — demo web stranica

Demo koncept web stranice za keramičarski obrt **Keramika Pilja** („Preciznost u svakom detalju“).
Statička stranica (HTML + CSS + JavaScript), bez build koraka. Spremna za objavu na Netlify.

> Demo koncept izradio WebCraft Design.

## Struktura

```
index.html          glavna stranica (sve sekcije)
assets/css/style.css dizajn, animacije, responzivnost
assets/js/main.js   meni, galerija, lightbox, prije/poslije, demo forma, kontakt dugmad
404.html            stranica za nepostojeće adrese
favicon.svg, site.webmanifest, robots.txt, sitemap.xml, netlify.toml
```

## Objava na Netlify

**Najbrže (drag & drop):** na https://app.netlify.com/drop prevucite cijeli folder projekta.

**Preko GitHuba:** Netlify → *Add new site* → *Import from Git* → odaberite repozitorij.
Build command ostavite prazno, publish directory je `.` (već podešeno u `netlify.toml`).

## Šta treba zamijeniti prije stvarne objave

| Šta | Gdje |
|---|---|
| Broj telefona, WhatsApp, Viber, link na Google recenzije | objekat `CONFIG` na vrhu `assets/js/main.js` |
| Demonstracijske fotografije (trenutno Unsplash) | `index.html`: hero, galerija (`data-full` za veću verziju), prije/poslije (`data-img`) |
| Oznake „Primjer“ / „Demonstracijska fotografija“ i demo traka | uklonite kad stavite stvarne fotografije radova |
| Lista usluga (oznaka „Demo sadržaj“) | sekcija `#usluge` u `index.html` |
| Google recenzije | sekcija `#recenzije` (npr. Elfsight ili Trustindex widget) |
| Domena | `robots.txt`, `sitemap.xml`; dodajte `<link rel="canonical">` i `og:url` |
| Logo | trenutni znak (4 pločice) je privremeni; stvarni logo firme nije pronađen u pouzdanom izvoru |

Dok su kontakt polja u `CONFIG` prazna, dugmad prikazuju obavještenje umjesto da pokreću poziv ili poruku.

## Forma za procjenu

Forma je **demonstracijska**: provjerava unos i prikazuje potvrdu, ali ništa ne šalje i ne pohranjuje.
Za stvarno slanje preko Netlify Forms dodajte formi `name="procjena" method="POST" data-netlify="true" enctype="multipart/form-data"`,
skriveno polje `<input type="hidden" name="form-name" value="procjena">` i uklonite `e.preventDefault()` u `main.js`.
