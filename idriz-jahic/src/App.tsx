import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer, { MobileContactBar } from "./components/Footer";
import Home from "./pages/Home";
import { supportsWebGL } from "./lib/hooks";

const Intro = lazy(() => import("./components/Intro"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const INTRO_KEY = "ij-intro-seen";

/** Intro se predvaja samo ob prvem obisku v seji, na naslovni strani in brez "reduced motion". */
function shouldPlayIntro(pathname: string) {
  if (pathname !== "/") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!supportsWebGL()) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export default function App() {
  const { pathname, hash } = useLocation();
  const [intro, setIntro] = useState(() => shouldPlayIntro(pathname));

  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* zasebni način */ }
    setIntro(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = intro ? "hidden" : "";
  }, [intro]);

  // ob menjavi strani na vrh (ali na sidro)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a href="#vsebina" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-volt focus:px-4 focus:py-2">
        Preskoči na vsebino
      </a>
      {intro && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] bg-ink" />}>
          <Intro onDone={finishIntro} />
        </Suspense>
      )}
      <Header />
      <main id="vsebina">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home ready={!intro} />} />
            <Route path="/zasebnost" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileContactBar />
    </>
  );
}
