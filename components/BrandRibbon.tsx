"use client";

import Link from "next/link";
import { useState } from "react";
import { House, Send } from "lucide-react";

const telegramHcsUrl = "https://t.me/sourcedekhohcs";

export default function BrandRibbon() {
  const [hovered, setHovered] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const isExpanded = hovered || telegramOpen;

  const handleAsideMouseLeave = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (telegramOpen) return;

    const nextTarget = event.relatedTarget as Node | null;

    if (
      nextTarget instanceof Node &&
      nextTarget instanceof Element &&
      nextTarget.closest('[data-telegram-panel="true"]')
    ) {
      return;
    }

    setHovered(false);
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleAsideMouseLeave}
      className={`fixed left-4 top-4 z-50 rounded-[28px] border border-white/70 bg-white/20 p-3 shadow-[0_22px_40px_-22px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 ${
        isExpanded ? "h-[90vh] w-[220px]" : "h-[90vh] w-28"
      }`}
    >
      <div className="relative flex h-full w-full flex-col items-center gap-3 pt-2">
        <img
          src="/logo.png"
          alt="SourceDekho"
          className="h-14 w-auto shrink-0 object-contain drop-shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
        />

        {isExpanded && (
          <>
            <span className="truncate text-center text-sm font-semibold tracking-[0.18em] text-slate-800">
              SourceDekho
            </span>

            <nav className="mt-2 flex w-full flex-col gap-2">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/80"
              >
                <House className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <button
                type="button"
                onClick={() => setTelegramOpen((value) => !value)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white/80"
              >
                <Send className="h-4 w-4" />
                <span>Telegram</span>
              </button>
            </nav>
          </>
        )}
      </div>

      {telegramOpen && (
        <div
          data-telegram-panel="true"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed left-[calc(100%+14px)] top-4 z-[600] w-[300px] rounded-[28px] border border-slate-200/80 ] backdrop-blur-xl"
        >
          <div className="relative">
            <button
              type="button"
              aria-label="Hide Telegram panel"
              onClick={() => setTelegramOpen(false)}
              className="absolute -right-2 top-1/2 z-[10] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)] backdrop-blur-xl transition hover:bg-white"
            >
              <span className="text-lg leading-none">←</span>
            </button>

            <div className="space-y-2 pr-6">
              <img
                src="/telegram.png"
                alt="Telegram QR code"
                className="mx-auto h-68 w-68 rounded-xl object-contain"
              />

              <a
                href={telegramHcsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-center text-xs font-semibold text-sky-700 underline underline-offset-2"
              >
                {telegramHcsUrl}
              </a>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}
