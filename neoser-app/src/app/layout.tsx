import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { WhatsappFab } from "@/components/whatsapp-button";
import { WhatsappModalProvider } from "@/components/whatsapp-modal-provider";

const montserrat = localFont({
  src: "../../public/fonts/abhayalibre-semibold.ttf",
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: false,
});

const playfair = localFont({
  src: "../../public/fonts/abhayalibre-extrabold.ttf",
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

const dancing = localFont({
  src: "../../public/fonts/brush-script.ttf",
  variable: "--font-dancing",
  display: "swap",
  preload: false,
  fallback: ["Brush Script MT", "cursive"],
  adjustFontFallback: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://neoser.pe";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b3a6b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NeoSer | Maternidad y Medicina Humanizada — Chiclayo",
    template: "%s | NeoSer",
  },
  description:
    "Centro de maternidad y medicina humanizada en Chiclayo. Control prenatal, parto humanizado, técnica Rebozo, cursos profesionales y acompañamiento postparto.",
  keywords: [
    "maternidad humanizada",
    "parto humanizado Chiclayo",
    "control prenatal Chiclayo",
    "técnica Rebozo",
    "cursos de obstetricia",
    "preparación al parto",
    "lactancia materna",
    "Spinning Babies Perú",
    "centro de maternidad Lambayeque",
    "Diana Silva Mejía obstetra",
  ],
  authors: [{ name: "NeoSer" }],
  creator: "NeoSer",
  publisher: "NeoSer",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "NeoSer",
    title: "NeoSer | Maternidad y Medicina Humanizada — Chiclayo",
    description:
      "Centro de maternidad y medicina humanizada en Chiclayo. Acompañamos cada etapa de tu maternidad con calidez, profesionalismo y respeto.",
    images: [
      {
        url: "/assets/logo-full-color.png",
        width: 1200,
        height: 630,
        alt: "NeoSer - Maternidad y Medicina Humanizada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoSer | Maternidad y Medicina Humanizada — Chiclayo",
    description:
      "Centro de maternidad humanizada en Chiclayo. Control prenatal, parto humanizado, cursos y acompañamiento postparto.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-PE"
      className={`${montserrat.variable} ${playfair.variable} ${dancing.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <WhatsappModalProvider>
          {children}
          <WhatsappFab />
        </WhatsappModalProvider>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
