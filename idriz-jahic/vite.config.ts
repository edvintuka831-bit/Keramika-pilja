import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Javni naslov strani: ročno (SITE_URL) ali samodejno na Netlifyju (URL).
const SITE_URL = (process.env.SITE_URL || process.env.URL || "https://idriz-jahic.netlify.app").replace(/\/$/, "");

const ROUTES = ["/", "/zasebnost"];

// Obrazec deluje prek Netlify Forms. Drugje (lokalno, drug gostitelj) ga izklopimo,
// da uporabnik nikoli ne vidi lažne potrditve o poslanem sporočilu.
const FORMS_ENABLED = process.env.NETLIFY === "true" || process.env.FORMS_ENABLED === "true";

// Vstavi pravi naslov v meta oznake in ustvari robots.txt ter sitemap.xml ob buildu.
function seo(): Plugin {
  return {
    name: "seo-files",
    transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", SITE_URL),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          ROUTES.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
          `\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  define: { __FORMS_ENABLED__: JSON.stringify(FORMS_ENABLED) },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1200,
  },
});
