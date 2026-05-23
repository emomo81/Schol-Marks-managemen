import type { Metadata } from "next";
import { IBM_Plex_Sans, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Confidence School System — Marks Management",
  description: "School marks management for Confidence School System, Liberia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${crimsonPro.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
