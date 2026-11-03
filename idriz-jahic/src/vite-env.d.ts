/// <reference types="vite/client" />

declare module "*.webp" {
  const src: string;
  export default src;
}

/** Ali je pošiljanje obrazca omogočeno (build na Netlifyju). */
declare const __FORMS_ENABLED__: boolean;
