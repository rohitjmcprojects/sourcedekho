"use client";

import Link from "next/link";
import { useState } from "react";
import { House, Send } from "lucide-react";

const telegramUrl = "https://t.me/sourcedekho";

export default function BrandRibbon() {
  const [hovered, setHovered] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);

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

              <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-2">
                <button
                  type="button"
                  onClick={() => setTelegramOpen((value) => !value)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-white/80"
                >
                  <Send className="h-4 w-4" />
                  <span>Telegram</span>
                </button>

                {telegramOpen && (
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(telegramUrl)}`}
                      alt="Telegram QR code"
                      className="mx-auto h-32 w-32 rounded-xl bg-white p-2"
                    />

                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block truncate text-center text-xs font-semibold text-sky-700 underline underline-offset-2"
                    >
                      {telegramUrl}
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </>
        )}
      </div>
    </aside>
  );
}
