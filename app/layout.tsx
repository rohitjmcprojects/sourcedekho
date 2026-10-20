import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import BrandRibbon from "@/components/BrandRibbon";

export const metadata: Metadata = {
  title: "SourceDekho",
  description: "Welcome page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="relative m-0 bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] text-slate-900">
          <div className="relative z-10 min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] p-4 pl-[160px]">
            {children}
          </div>

          <div className="fixed bottom-5 right-5 z-50 rounded-full border border-white/70 bg-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.5)] backdrop-blur-xl">
            Visitors: NA
          </div>

          <BrandRibbon />
        </body>
      </html>
    </ClerkProvider>
  );
}