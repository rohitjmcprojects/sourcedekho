import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SourceDekho",
  description: "Competitive Exam Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#f5f7fb]">
          {/* GLOBAL SIDEBAR */}
          <Sidebar />

          {/* ALL PAGES */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}