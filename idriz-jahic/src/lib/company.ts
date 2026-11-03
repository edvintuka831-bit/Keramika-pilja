export const COMPANY = {
  name: "IDRIZ JAHIĆ S.P.",
  activity: "Varjenje in druge storitve",
  slogan: "Moč kovine. Natančnost izvedbe. Zaupanje brez kompromisov.",
  phoneDisplay: "051 890 217",
  phoneHref: "tel:+38651890217",
  email: "idrizjahic95@gmail.com",
  emailHref: "mailto:idrizjahic95@gmail.com",
  street: "Ob Železnici 14",
  city: "2000 Maribor",
  country: "Slovenija",
  mapsQuery: "Ob Železnici 14, 2000 Maribor, Slovenija",
} as const;

export const MAPS_NAV_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COMPANY.mapsQuery)}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapsQuery)}&output=embed`;

export const SERVICE_OPTIONS = [
  "MIG / MAG / TIG varjenje",
  "Kovinske konstrukcije",
  "Montaža in popravila",
  "Rezanje in obdelava kovin",
  "Varilska in montažna dela po naročilu",
  "Drugo",
] as const;
