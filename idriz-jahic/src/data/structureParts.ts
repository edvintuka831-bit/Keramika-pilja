export type PartId = "column" | "rafter" | "endplate" | "haunch" | "anchor" | "weld" | "bracing" | "purlin";

export type Part = {
  id: PartId;
  name: string;
  spec: string;
  text: string;
  /** Položaj oznake v sceni (m). */
  hotspot: [number, number, number];
  /** Točka, na katero se usmeri kamera. */
  focus: [number, number, number];
  /** Smer pogleda od točke fokusa. */
  view: [number, number, number];
  distance: number;
};

/*
 * Opisi delov tipske jeklene hale (prikazni 3D model, ne konkreten projekt).
 */
export const PARTS: Part[] = [
  {
    id: "column",
    name: "Steber",
    spec: "Vroče valjani profil HEB 200",
    text: "Nosi navpične obremenitve strehe in jih prenaša v temelje. Stebri morajo biti postavljeni navpično in natančno poravnani – od tega je odvisna geometrija celotne konstrukcije.",
    hotspot: [3, 2.2, 2],
    focus: [3, 2, 2],
    view: [1.2, 0.4, 1],
    distance: 4.2,
  },
  {
    id: "rafter",
    name: "Prečni nosilec",
    spec: "Profil IPE 300",
    text: "Prečka okvirja premošča razpon med stebroma in prevzema obtežbo strehe, snega in vetra. Dolžino, previšanje in luknje za spoje pripravimo pred montažo.",
    hotspot: [0, 4.3, 2],
    focus: [0, 4.2, 2],
    view: [0.3, 0.35, 1],
    distance: 5,
  },
  {
    id: "endplate",
    name: "Čelni vijačni spoj",
    spec: "Čelna pločevina z visokovrednimi vijaki",
    text: "Togi spoj stebra in nosilca. Pločevina je privarjena na nosilec, na gradbišču pa se elementa povežeta z vijaki, ki se privijejo s predpisanim momentom.",
    hotspot: [-2.85, 4.05, 2.15],
    focus: [-2.85, 4.05, 2],
    view: [-0.6, 0.2, 1],
    distance: 1.5,
  },
  {
    id: "haunch",
    name: "Vuta",
    spec: "Ojačitev vogala okvirja",
    text: "Trikotna pločevina ojača vogal, kjer so upogibni momenti največji. Privari se z obojestranskimi kotnimi zvari.",
    hotspot: [2.55, 3.65, -2],
    focus: [2.6, 3.7, -2],
    view: [-0.4, 0.1, -1],
    distance: 2,
  },
  {
    id: "anchor",
    name: "Sidrna plošča",
    spec: "Plošča s sidrnimi vijaki",
    text: "Povezuje steber s temeljem. Natančna višina in poravnava sidrnih vijakov sta pogoj za pravilno postavitev stebrov.",
    hotspot: [-3.25, 0.15, -2.2],
    focus: [-3, 0.1, -2],
    view: [-0.8, 0.6, -0.6],
    distance: 1.6,
  },
  {
    id: "weld",
    name: "Kotni zvar",
    spec: "Zvar MAG ob vznožju stebra",
    text: "Neprekinjen kotni zvar povezuje steber s sidrno ploščo. Pomembni so pravilna debelina zvara, dober uvar in čista površina brez por in razpok.",
    hotspot: [3.15, 0.25, -1.85],
    focus: [3, 0.1, -2],
    view: [0.7, 0.5, 0.9],
    distance: 1.1,
  },
  {
    id: "bracing",
    name: "Zavetrovanje",
    spec: "Križno zavetrovanje iz kvadratnih cevi",
    text: "Diagonale prevzamejo vodoravne sile vetra in preprečijo zibanje konstrukcije v vzdolžni smeri.",
    hotspot: [-3.1, 2.1, 0],
    focus: [-3, 2, 0],
    view: [-1, 0.25, 0.2],
    distance: 5.5,
  },
  {
    id: "purlin",
    name: "Strešne lege",
    spec: "Profil IPE 160",
    text: "Lege povezujejo okvirja in nosijo strešno kritino. Pritrdijo se na prečne nosilce z vijaki ali zvarom.",
    hotspot: [1.4, 4.55, 0.6],
    focus: [0, 4.4, 0],
    view: [0.5, 1, 0.6],
    distance: 5,
  },
];
