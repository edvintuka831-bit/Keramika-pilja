import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import Structure3D from "../components/sections/Structure3D";
import Gallery from "../components/sections/Gallery";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import { usePageMeta } from "../lib/hooks";

export default function Home({ ready }: { ready: boolean }) {
  usePageMeta(
    "IDRIZ JAHIĆ S.P. | Varjenje MIG/MAG/TIG, kovinske konstrukcije, Maribor",
    "IDRIZ JAHIĆ S.P. – profesionalno varjenje MIG/MAG/TIG, kovinske konstrukcije, montaža in popravila ter rezanje in obdelava kovin v Mariboru in okolici. Pošljite povpraševanje.",
  );
  return (
    <>
      <Hero ready={ready} />
      <Services />
      <Structure3D />
      <Gallery />
      <About />
      <Contact />
    </>
  );
}
