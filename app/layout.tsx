import type { Metadata } from "next";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

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
        <body>
          {/* TOP NAV */}
          <div className="h-16 border-b flex items-center justify-end px-6 bg-white sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SignInButton />
              <UserButton />
            </div>
          </div>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}