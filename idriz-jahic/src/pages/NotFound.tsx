import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/hooks";

export default function NotFound() {
  usePageMeta("Stran ne obstaja | IDRIZ JAHIĆ S.P.");
  return (
    <section className="grid-lines grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <meta name="robots" content="noindex" />
      <div>
        <p className="font-display text-[clamp(6rem,22vw,14rem)] font-bold italic leading-none text-volt-glow">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase italic text-metal">Stran ne obstaja</h1>
        <p className="mt-4 text-steel-2">Stran, ki jo iščete, je bila odstranjena ali pa naslov ni pravilen.</p>
        <Link to="/" className="btn btn-volt mt-8">Na naslovno stran</Link>
      </div>
    </section>
  );
}
