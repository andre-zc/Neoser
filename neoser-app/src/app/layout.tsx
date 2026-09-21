import type { Metadata, Viewport } from "next";
import { Montserrat, Noto_Serif_Display } from "next/font/google";
import "./globals.css";
import { WhatsappModalProvider } from "@/components/whatsapp-modal-provider";
import { SiteChrome } from "@/components/site-chrome";
import { LEGAL } from "@/lib/legal";
import { SiteAnalytics } from "@/components/site-analytics";

/** Cuerpo / UI / etiquetas — brand book */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Títulos / display — brand book (variable CSS legado --font-playfair) */
const playfair = Noto_Serif_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://neoser.pe";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// El ID del pixel es publico. La variable permite cambiarlo sin tocar codigo.
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "6381069198640066";
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

const SITE_DESCRIPTION =
  "Partos humanizados en Chiclayo: cero separación, piel con piel, acompañamiento respetuoso e inicio temprano de lactancia materna. Centro NeoSer de maternidad y medicina humanizada.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b3a6b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NeoSer | Partos Humanizados y Maternidad — Chiclayo",
    template: "%s | NeoSer",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "partos humanizados Chiclayo",
    "parto humanizado Chiclayo",
    "cero separación",
    "piel con piel",
    "lactancia materna Chiclayo",
    "maternidad humanizada",
    "acompañamiento al parto",
    "cesárea humanizada",
    "control prenatal Chiclayo",
    "Diana Silva Mejía obstetra",
    "centro de maternidad Lambayeque",
  ],
  authors: [{ name: "NeoSer" }],
  creator: "NeoSer",
  publisher: "NeoSer",
  applicationName: "NeoSer",
  icons: {
    icon: [
      // URL nueva (2026) para forzar que Google deje de usar el favicon viejo de Vercel.
      { url: "/brand/neoser-icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/brand/neoser-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/neoser-icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/brand/neoser-favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/brand/neoser-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/brand/neoser-icon-48.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#1b3a6b",
    "msapplication-TileImage": "/brand/neoser-icon-192.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "NeoSer",
    title: "NeoSer | Partos Humanizados en Chiclayo",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/logo-full-color.png",
        width: 1200,
        height: 630,
        alt: "NeoSer - Partos humanizados en Chiclayo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoSer | Partos Humanizados en Chiclayo",
    description: SITE_DESCRIPTION,
    images: ["/assets/logo-full-color.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: GSC_VERIFICATION
    ? { google: GSC_VERIFICATION }
    : undefined,
  category: "health",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: "NeoSer",
  alternateName: "NeoSer Perú",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: LEGAL.telefonoLink,
  email: LEGAL.email,
  image: `${SITE_URL}/assets/logo-full-color.png`,
  logo: `${SITE_URL}/brand/neoser-icon-512.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Los Sauces 542, Urb. Santa Victoria",
    addressLocality: "Chiclayo",
    addressRegion: "Lambayeque",
    addressCountry: "PE",
  },
  areaServed: {
    "@type": "City",
    name: "Chiclayo",
  },
  medicalSpecialty: "Obstetrics",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios NeoSer",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Partos humanizados",
          description:
            "Acompañamiento del nacimiento con cero separación, contacto piel con piel e inicio temprano de la lactancia materna en Chiclayo.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Acompañamiento prenatal y postparto",
          description:
            "Control prenatal, preparación al parto y apoyo a la lactancia materna con enfoque humanizado.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-PE"
      className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <WhatsappModalProvider>
          {children}
          <SiteChrome />
        </WhatsappModalProvider>
        <SiteAnalytics measurementId={GA_ID} metaPixelId={META_PIXEL_ID} />
      </body>
    </html>
  );
}
