/*
 * GALERIJA IZVEDENIH DEL
 *
 * Tukaj dodajte SAMO fotografije del, ki jih je dejansko izvedlo podjetje IDRIZ JAHIĆ S.P.
 * 1. Fotografijo shranite v mapo public/gallery/ (npr. public/gallery/nadstresek-1.jpg).
 *    Priporočeno: JPG ali WebP, širina 1600–2000 px, velikost do ~400 KB.
 * 2. Dodajte vnos v seznam GALLERY spodaj, npr.:
 *
 *    { src: "/gallery/nadstresek-1.jpg", title: "Jekleni nadstrešek", category: "konstrukcije", alt: "Jekleni nadstrešek nad vhodom" },
 *
 * Dokler je seznam prazen, galerija prikaže obvestilo, da bodo fotografije dodane kmalu.
 */

export type GalleryCategory = "varjenje" | "konstrukcije" | "montaza" | "obdelava";

export type GalleryItem = {
  src: string;
  title: string;
  category: GalleryCategory;
  alt: string;
  /** Neobvezna manjša različica za mrežo (sicer se uporabi src). */
  thumb?: string;
};

export const CATEGORIES: { id: GalleryCategory | "vse"; label: string }[] = [
  { id: "vse", label: "Vse" },
  { id: "varjenje", label: "Varjenje" },
  { id: "konstrukcije", label: "Konstrukcije" },
  { id: "montaza", label: "Montaža" },
  { id: "obdelava", label: "Obdelava" },
];

export const GALLERY: GalleryItem[] = [];
