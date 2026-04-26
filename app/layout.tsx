import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import Providers from "./components/Providers";
import SiteChrome from "./components/SiteChrome";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Robocura Massage Chair",
  description:
    "Buy premium massage chairs with advanced features like zero gravity, heat therapy & more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
