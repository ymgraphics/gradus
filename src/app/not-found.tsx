"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import frDict from "@/i18n/dictionaries/fr.json";
import enDict from "@/i18n/dictionaries/en.json";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
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
      <html lang="fr" className={`${clashDisplay.variable} antialiased`}>
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="flex flex-col min-h-screen bg-[#080808] text-white font-body selection:bg-gradus-gold selection:text-black antialiased m-0 p-0 overflow-x-hidden">
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} className={`${clashDisplay.variable} antialiased`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>{dict.notfound?.title || "Page Non Trouvée"} | Gradus</title>
      </head>
      <body className="flex flex-col min-h-screen bg-[#080808] text-white font-body selection:bg-gradus-gold selection:text-black antialiased m-0 p-0 overflow-x-hidden">
        <LanguageProvider initialDictionary={dict} locale={locale}>
          <Navbar />
          
          <main className="flex-grow flex flex-col items-center justify-center relative z-10 p-6 pt-48 pb-24 overflow-hidden min-h-[80vh]">
            {/* Glassmorphism Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradus-gold/5 blur-[120px] rounded-full" />
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full">
              {/* 404 Content */}
              <div className="w-full liquid-glass bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-[40px] p-10 md:p-16 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <span className="text-8xl md:text-[150px] font-display font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/20 mb-6 md:mb-8 drop-shadow-2xl">
                  404
                </span>
                
                <h1 className="text-2xl md:text-4xl font-heading font-bold mb-4">
                  {dict.notfound?.title || "Page Non Trouvée"}
                </h1>
                
                <p className="text-white/50 text-base md:text-lg max-w-lg mb-10 font-light leading-relaxed">
                  {dict.notfound?.description || "Il semble que la page que vous recherchez n'existe plus ou a été déplacée. Retournons à l'essentiel pour propulser votre marque."}
                </p>

                <Link
                  href={`/${locale === 'en' ? 'en' : ''}`}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradus-gold text-gradus-primary px-8 py-4 rounded-full font-bold overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(96,80,220,0.3)] hover:scale-[1.02] transition-all duration-500 interactive"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {dict.notfound?.back || "Retour à l'accueil"}
                    <ArrowUpRight
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </main>
          
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
