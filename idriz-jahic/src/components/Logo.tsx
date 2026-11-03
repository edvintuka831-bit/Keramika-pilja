import { useId } from "react";

/** IJ monogram (vektorska različica 3D logotipa). */
export function Monogram({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 30" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#8b94a1" />
          <stop offset="1" stopColor="#e2e6eb" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4aa3ff" />
          <stop offset="1" stopColor="#0057c8" />
        </linearGradient>
      </defs>
      <g transform="translate(2 28) scale(.27 -.27) skewX(12)">
        <path fill={`url(#${id}s)`} d="M0 0H44V4L32 14V86L44 96V100H0V96L12 86V14L0 4Z" />
        <path fill={`url(#${id}v)`} d="M50 100H104V96L88 86V30Q88 0 62 0Q42 0 40 18L39 32L52 40L54 26Q56 16 64 16Q68 16 68 26V86L52 96H50Z" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Monogram className="h-9 w-12 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-bold uppercase italic tracking-wide">
          <span className="text-metal">Idriz Jahić</span> <span className="text-volt-2 text-sm not-italic">S.P.</span>
        </span>
        {!compact && (
          <span className="mt-1 font-display text-[0.7rem] font-semibold uppercase italic tracking-[0.28em] text-volt-2/90">
            Varjenje in druge storitve
          </span>
        )}
      </span>
    </span>
  );
}
