import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Glowguide - Your Perfect Makeup Match",
  description: "Discover your ideal makeup with AI-powered recommendations. Get personalized beauty suggestions tailored to your unique features and style.",
  keywords: "makeup, beauty, AI, recommendations, cosmetics, personalized, skincare",
  authors: [{ name: "Glowguide Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfairDisplay.variable} antialiased min-h-screen`}
        style={{ backgroundColor: 'var(--bg-light)' }}
      >
        {children}
      </body>
    </html>
  );
}
