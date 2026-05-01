import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "PersonaGen AI — Market Research Platform",
  description:
    "AI-powered persona generation, multi-persona debate simulation, and market insight extraction.",
  keywords: [
    "market research",
    "user personas",
    "AI",
    "Claude",
    "UX research",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="mesh-bg noise-overlay min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scroll-thin">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
