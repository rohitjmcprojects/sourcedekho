"use client";

import { useState } from "react";

export default function BrandRibbon() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-4 top-4 z-50 rounded-[28px] border border-white/70 bg-white/20 p-3 shadow-[0_22px_40px_-22px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "h-[90vh] w-28" : "h-[90vh] w-[220px]"
      }`}
    >
      <div className="relative flex h-full w-full flex-col items-center gap-3 pt-2">
        <div className="flex w-full items-start justify-end">
          <button
            type="button"
            aria-label={collapsed ? "Expand ribbon" : "Collapse ribbon"}
            onClick={() => setCollapsed((value) => !value)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300/70 bg-white/70 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <img
          src="/logo.png"
          alt="SourceDekho"
          className="h-14 w-auto shrink-0 object-contain drop-shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
        />

        {!collapsed && (
          <span className="truncate text-center text-sm font-semibold tracking-[0.18em] text-slate-800 uppercase">
            SourceDekho
          </span>
        )}
      </div>
    </aside>
  );
}
