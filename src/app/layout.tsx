import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { company } from "@/data/content";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--f-display",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-mono",
  display: "swap",
});

export const viewport = {
  themeColor: "#0C3C8F",
};

export const metadata: Metadata = {
  title: "Jai Bhawani Enterprises — Non-Ferrous Scrap Trading · Nashik, India",
  description:
    "Jai Bhawani Enterprises buys, processes and supplies aluminium, copper and brass scrap from MIDC Ambad, Nashik. Serving Maharashtra and Gujarat since 1998.",
  openGraph: {
    title: "Jai Bhawani Enterprises — Bought. Processed. Supplied.",
    description: "Non-ferrous scrap trading from Nashik since 1998.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  description: "Non-ferrous scrap trading — aluminium, copper and brass. Established 1998.",
  foundingDate: String(company.founded),
  telephone: `+${company.phoneTel}`,
  taxID: company.gst,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.line1,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.pin,
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
