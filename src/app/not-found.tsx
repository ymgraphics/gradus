"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import frDict from "@/i18n/dictionaries/fr.json";
import enDict from "@/i18n/dictionaries/en.json";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import { Instrument_Sans, Fragment_Mono } from "next/font/google";
import "@/app/globals.css";

const clashDisplay = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
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

const fontVars = `${clashDisplay.variable} ${instrumentSans.variable} ${fragmentMono.variable}`;

export default function NotFound() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [dict, setDict] = useState<any>(frDict);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // pathname might be null during SSR or some edges, fallback to window.location
    const currentPath = pathname || window.location.pathname;
    if (currentPath.startsWith("/en")) {
      setLocale("en");
      setDict(enDict);
    } else {
      setLocale("fr");
      setDict(frDict);
    }
    setMounted(true);
  }, [pathname]);

  if (!mounted) {
    // Render a minimal version for SSR to prevent hydration mismatch
    return (
      <html lang="fr" className={`${fontVars} antialiased`}>
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="flex flex-col min-h-screen bg-void text-text-primary font-body antialiased m-0 p-0 overflow-x-hidden">
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} className={`${fontVars} antialiased`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>{dict.notfound?.title || "Page Non Trouvée"} | Gradus</title>
      </head>
      <body className="flex flex-col min-h-screen bg-void text-text-primary font-body antialiased m-0 p-0 overflow-x-hidden">
        <LanguageProvider initialDictionary={dict} locale={locale}>
          <Navbar />
          
          <main className="flex-grow relative z-10 pt-40 pb-24 min-h-[80vh] flex items-center">
            <div className="container w-full">
              <p className="label-utility mb-10 flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
                {locale === "fr" ? "Erreur 404 — Page introuvable" : "Error 404 — Page not found"}
              </p>

              {/* The staircase, missing its last step */}
              <div className="font-display flex flex-col text-display-xl" aria-hidden="true">
                <span className="text-text-primary">4</span>
                <span className="ml-[4%] md:ml-[8.333%] text-text-primary">0</span>
                <span className="ml-[8%] md:ml-[16.666%] text-accent">4.</span>
              </div>

              <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end border-t border-gradus-border pt-10">
                <div className="lg:col-span-6">
                  <h1 className="text-display-md font-display text-text-primary mb-6">
                    {dict.notfound?.title || "Page Non Trouvée"}
                  </h1>
                  <p className="text-body text-text-secondary max-w-lg">
                    {dict.notfound?.description || "Il semble que la page que vous recherchez n'existe plus ou a été déplacée. Retournons à l'essentiel pour propulser votre marque."}
                  </p>
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  <Link
                    href={locale === "en" ? "/en" : "/"}
                    className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive"
                  >
                    {dict.notfound?.back || "Retour à l'accueil"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
