import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Instrument_Sans, Fragment_Mono } from "next/font/google";
import "@/app/globals.css";
import SmoothScroll from "@/layouts/SmoothScroll";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { i18n } from "@/i18n-config";
import { SITE_URL } from "@/lib/constants";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

const clashDisplay = localFont({
  src: [
    { path: "../../../../public/fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../../../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../../public/fonts/ClashDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../../../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
  preload: true,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-instrument-sans",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
  display: "swap",
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

// Viewport export — required in Next.js 14+ (not inside metadata)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
  colorScheme: "dark",
};

// Normalize base URL
const canonicalBase = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const isFrench = locale === 'fr';

  return {
    metadataBase: new URL(canonicalBase),
    title: {
      default: isFrench 
        ? "Gradus | Agence Créative & Marketing Digital à Casablanca"
        : "Gradus | Creative Agency & Digital Marketing in Casablanca",
      template: "%s | Gradus",
    },
    description: isFrench
      ? "Experts en marketing digital, design graphique premium, production vidéo et stratégie digitale à Casablanca, Maroc. Propulsez votre marque avec Gradus."
      : "Experts in digital marketing, premium graphic design, video production, and digital strategy in Casablanca, Morocco. Propel your brand with Gradus.",
    applicationName: "Gradus",
    authors: [{ name: "Gradus Agency" }],
    generator: "Next.js",
    keywords: isFrench 
      ? ["agence marketing digital casablanca", "creative agency morocco", "design graphique maroc", "production video casablanca", "branding agency morocco", "strategie digitale maroc", "conception 3d maroc"]
      : ["creative agency morocco", "digital marketing casablanca", "graphic design morocco", "video production casablanca", "branding agency morocco", "digital strategy morocco"],
    referrer: "origin-when-cross-origin",
    creator: "Gradus",
    publisher: "Gradus",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: isFrench ? "fr_FR" : "en_US",
      alternateLocale: isFrench ? ["en_US"] : ["fr_FR"],
      url: `${canonicalBase}/${locale}/`,
      siteName: "Gradus Agency",
      title: isFrench ? "Gradus | Agence Créative & Marketing Digital" : "Gradus | Creative Agency & Digital Marketing",
      description: isFrench
        ? "Experts en marketing digital, design, et production vidéo à Casablanca. Donnez vie à vos projets."
        : "Experts in digital marketing, design, and video production in Casablanca. Bring your projects to life.",
      images: [
        {
          url: `${canonicalBase}/assets/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Gradus Creative Agency — Casablanca, Maroc",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isFrench ? "Gradus | Agence Créative & Marketing Digital" : "Gradus | Creative Agency & Digital Marketing",
      description: isFrench
        ? "Experts en marketing digital, design, et production vidéo à Casablanca. Donnez vie à vos projets."
        : "Experts in digital marketing, design, and video production in Casablanca. Bring your projects to life.",
      images: [`${canonicalBase}/assets/og-image.png`],
      creator: "@gradus",
    },
    alternates: {
      canonical: `${canonicalBase}/${locale}`,
      languages: {
        'fr': `${canonicalBase}/fr`,
        'en': `${canonicalBase}/en`,
        'x-default': `${canonicalBase}/fr`
      }
    },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/assets/logo.svg", type: "image/svg+xml" },
        { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Rich Multi-Graph Schema.org structured data (Organization + LocalBusiness + WebSite)
const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${canonicalBase}/#organization`,
      "name": "Gradus Agency",
      "url": canonicalBase,
      "logo": {
        "@type": "ImageObject",
        "@id": `${canonicalBase}/#logo`,
        "url": `${canonicalBase}/assets/logo.png`,
        "caption": "Gradus Agency"
      },
      "image": {
        "@id": `${canonicalBase}/#logo`
      },
      "description": "Agence créative et marketing digital premium à Casablanca, Maroc. Experts en branding, design graphique, production vidéo et stratégie de marque.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "217 Bd Brahim Roudani",
        "addressLocality": "Casablanca",
        "postalCode": "20000",
        "addressCountry": "MA"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+212691404005",
        "contactType": "customer service",
        "email": "contact@gradus.ma",
        "availableLanguage": ["French", "English", "Arabic"]
      },
      "sameAs": [
        "https://instagram.com/gradusofficiel"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": `${canonicalBase}/#localbusiness`,
      "name": "Gradus Agency",
      "image": `${canonicalBase}/assets/og-image.png`,
      "priceRange": "$$$",
      "telephone": "+212691404005",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "217 Bd Brahim Roudani",
        "addressLocality": "Casablanca",
        "postalCode": "20000",
        "addressCountry": "MA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.5731,
        "longitude": -7.5898
      },
      "url": canonicalBase,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${canonicalBase}/#website`,
      "url": canonicalBase,
      "name": "Gradus Agency",
      "publisher": {
        "@id": `${canonicalBase}/#organization`
      }
    }
  ]
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  let customPrimary = "";
  let customGold = "";
  let customOrange = "";
  let customFont = "";
  
  try {
    const { dbGet } = await import("@/lib/admin-db");
    const settings = await dbGet("site_settings", "global");
    if (settings) {
      customPrimary = (settings.color_primary as string) || "";
      customGold = (settings.color_gold as string) || "";
      customOrange = (settings.color_orange as string) || "";
      customFont = (settings.font_family as string) || "";
    }
  } catch (e) {
    console.error("Failed to fetch global settings for theme", e);
  }

  return (
    <html
      lang={locale}
      dir={(locale as string) === 'ar' ? 'rtl' : 'ltr'}
      className={`${clashDisplay.variable} ${instrumentSans.variable} ${fragmentMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        {(customPrimary || customGold || customOrange || customFont) && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  ${customPrimary ? `--color-gradus-primary: ${customPrimary};` : ''}
                  ${customGold ? `--color-gradus-gold: ${customGold};` : ''}
                  ${customOrange ? `--color-gradus-orange: ${customOrange};` : ''}
                  ${customFont ? `
                    --font-display: ${customFont}, sans-serif;
                    --font-heading: ${customFont}, sans-serif;
                    --font-body: ${customFont}, sans-serif;
                  ` : ''}
                }
              `
            }}
          />
        )}
      </head>
      <body
        className="flex flex-col min-h-screen bg-gradus-primary text-gradus-text font-body"
        suppressHydrationWarning
      >
        <LanguageProvider initialDictionary={dict} locale={locale}>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
