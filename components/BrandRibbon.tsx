"use client";

import { useState } from "react";

export default function BrandRibbon() {
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed left-4 top-4 z-50 rounded-[28px] border border-white/70 bg-white/20 p-3 shadow-[0_22px_40px_-22px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 ${
        hovered ? "h-[90vh] w-[220px]" : "h-[90vh] w-28"
      }`}
    >
      <div className="relative flex h-full w-full flex-col items-center gap-3 pt-2">
        <img
          src="/logo.png"
          alt="SourceDekho"
          className="h-14 w-auto shrink-0 object-contain drop-shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
        />

        {hovered && (
          <span className="truncate text-center text-sm font-semibold tracking-[0.18em] text-slate-800">
            SourceDekho
          </span>
        )}
      </div>
    </aside>
  );
}
