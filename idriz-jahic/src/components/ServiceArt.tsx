import type { Service } from "../data/services";

/*
 * Tehnične črtne ilustracije storitev. Poti z razredom "draw" se ob drsenju izrišejo (GSAP),
 * elementi z razredom "glow" pa zasvetijo.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Weld() {
  return (
    <g {...S}>
      {/* pločevini */}
      <path className="draw" d="M40 210 L190 210 L190 228 L40 228 Z" />
      <path className="draw" d="M210 210 L360 210 L360 228 L210 228 Z" />
      {/* zvar */}
      <path className="draw text-volt-2" stroke="currentColor" strokeWidth={3} d="M80 207 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0" />
      {/* gorilnik */}
      <path className="draw" d="M206 196 L222 150 L236 150 L226 198 Z" />
      <path className="draw" d="M222 150 L250 70 L270 74 L236 150" />
      <path className="draw" d="M250 70 Q270 30 330 36" />
      <circle className="glow" cx="206" cy="204" r="7" fill="#9fd0ff" stroke="none" />
      {[[-30, -26], [-18, -40], [6, -44], [24, -30], [-40, -10], [36, -14]].map(([dx, dy], i) => (
        <path key={i} className="draw text-volt-2" d={`M206 204 l${dx} ${dy}`} strokeWidth={1.2} />
      ))}
    </g>
  );
}

function Structure() {
  return (
    <g {...S}>
      <path className="draw" d="M70 250 V90 M90 250 V90 M310 250 V90 M330 250 V90" />
      <path className="draw" d="M60 90 H340 M60 70 H340 M60 70 V90 M340 70 V90" />
      <path className="draw text-volt-2" d="M90 250 L200 90 M310 250 L200 90 M90 170 H310" />
      <path className="draw" d="M90 110 L130 90 M310 110 L270 90" />
      <path className="draw" d="M50 250 H110 M290 250 H350" strokeWidth={3} />
      {[70, 90, 310, 330].map((x) => <circle key={x} className="glow" cx={x} cy={80} r={3} fill="#4aa3ff" stroke="none" />)}
    </g>
  );
}

function Assembly() {
  return (
    <g {...S}>
      {/* zobnik */}
      <path className="draw" d="M150 110 l10 -24 l20 4 l4 -24 h20 l4 24 l20 -4 l10 24 l-18 14 l8 22 l-18 12 l-14 -18 l-14 18 l-18 -12 l8 -22 Z" transform="translate(-20 40)" />
      <circle className="draw text-volt-2" cx="185" cy="150" r="20" />
      {/* ključ */}
      <path className="draw" d="M230 200 L320 110 M240 210 L330 120 M320 110 a18 18 0 1 1 10 10" />
      <path className="draw" d="M230 200 a14 14 0 1 0 10 10" />
      {/* vijaki */}
      {[80, 120, 280, 320].map((x) => <path key={x} className="draw" d={`M${x} 250 v-18 h10 v18 M${x - 4} 232 h18`} />)}
      <path className="draw" d="M60 250 H350" strokeWidth={3} />
      <circle className="glow" cx="185" cy="150" r="5" fill="#4aa3ff" stroke="none" />
    </g>
  );
}

function Cutting() {
  return (
    <g {...S}>
      {/* profil */}
      <path className="draw" d="M40 200 H360 M40 230 H360 M40 200 V230 M360 200 V230" />
      <path className="draw text-volt-2" d="M200 196 V234" strokeDasharray="4 5" />
      {/* brusilka */}
      <circle className="draw" cx="200" cy="150" r="46" />
      <circle className="draw" cx="200" cy="150" r="8" />
      <path className="draw" d="M200 104 L250 70 H330 V100 H260 L238 116" />
      <path className="draw" d="M154 150 Q150 120 175 108" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (-150 + i * 12) * (Math.PI / 180);
        return <path key={i} className="draw text-volt-2" strokeWidth={1.2} d={`M200 198 l${Math.cos(a) * (60 + (i % 3) * 18)} ${-Math.abs(Math.sin(a)) * (30 + (i % 4) * 10)}`} />;
      })}
      <circle className="glow" cx="200" cy="198" r="6" fill="#ffb347" stroke="none" />
    </g>
  );
}

function Custom() {
  return (
    <g {...S}>
      {/* načrt */}
      <path className="draw" d="M50 60 H250 V250 H50 Z" />
      <path className="draw text-volt-2" d="M80 210 V120 L150 90 L220 120 V210 Z M80 160 H220 M150 90 V210" />
      <path className="draw" d="M80 228 H220 M80 222 v12 M220 222 v12" strokeWidth={1} />
      <path className="draw" d="M236 120 V210 M230 120 h12 M230 210 h12" strokeWidth={1} />
      {/* svinčnik / ravnilo */}
      <path className="draw" d="M280 250 L350 80 L362 86 L292 256 Z M280 250 l4 14 l8 -8" />
      <path className="draw" d="M300 60 h60 v14 h-60 z M310 60 v6 M320 60 v9 M330 60 v6 M340 60 v9 M350 60 v6" strokeWidth={1.2} />
      <circle className="glow" cx="150" cy="160" r="4" fill="#4aa3ff" stroke="none" />
    </g>
  );
}

const ART: Record<Service["art"], () => React.JSX.Element> = { weld: Weld, structure: Structure, assembly: Assembly, cutting: Cutting, custom: Custom };

export default function ServiceArt({ art }: { art: Service["art"] }) {
  const Art = ART[art];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full text-steel" role="img" aria-hidden="true">
      <Art />
    </svg>
  );
}
