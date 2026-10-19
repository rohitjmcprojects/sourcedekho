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
          <div className="relative z-10 min-h-screen p-4 pl-[160px]">{children}</div>
          <BrandRibbon />
        </body>
      </html>
    </ClerkProvider>
  );
}