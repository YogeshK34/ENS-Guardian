import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ENS Guardian — Trust Before You Send",
    template: "%s | ENS Guardian",
  },
  description:
    "Analyze ENS names for phishing, typosquatting, and trust signals before sending crypto. Security-focused ENS reputation engine.",
  keywords: ["ENS", "Ethereum Name Service", "crypto security", "phishing detection", "typosquatting", "Web3 security"],
  openGraph: {
    title: "ENS Guardian — Trust Before You Send",
    description: "Analyze ENS names for phishing, typosquatting, and trust signals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <TooltipProvider>
          <div className="scan-line" aria-hidden="true" />
          <Navbar />
          <main>{children}</main>
          <Toaster theme="dark" position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
