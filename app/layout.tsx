import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./operations.css";
import "./dms.css";
import FullPageNavigation from "./FullPageNavigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealerCore | Dealership Management System",
  description: "DealerCore dealership management system for sales, CRM, workshop, parts, purchasing and management control.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}><body><FullPageNavigation />{children}</body></html>;
}
