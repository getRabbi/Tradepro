import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TradePro — Trade Global Markets Online with Confidence",
    template: "%s | TradePro",
  },
  description: "Trade Forex, Commodities, Indices, Stocks, Crypto, and Metals. Fast, secure, and regulated trading for every trader.",
  openGraph: {
    title: "TradePro — Trade Global Markets Online",
    description: "Trade 160+ instruments across Forex, Stocks, Crypto, Indices, Commodities, and Metals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-900 text-text-primary font-body antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
