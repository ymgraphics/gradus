import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  const isFr = locale === "fr";

  return {
    title: isFr ? "Plan du Site | Gradus" : "Sitemap | Gradus",
    description: isFr 
      ? "Plan complet du site internet Gradus Agency." 
      : "Complete sitemap of the Gradus Agency website.",
    alternates: {
      canonical: `${baseUrl}/${locale}/sitemap`,
    },
  };
}

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const isFr = locale === "fr";

  return (
    <main className="min-h-screen bg-gradus-primary text-white">
      <Navbar />
      <section className="container pt-36 pb-24 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-normal mb-12">
          {isFr ? "Plan du Site" : "Sitemap"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Main Pages */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-gradus-gold mb-6 border-b border-white/10 pb-2">
              {isFr ? "Pages Principales" : "Main Pages"}
            </h2>
            <ul className="space-y-4">
              <li><Link href={`/${locale}/`} className="text-white/70 hover:text-white transition-colors">Accueil / Home</Link></li>
              <li><Link href={`/${locale}/about`} className="text-white/70 hover:text-white transition-colors">{isFr ? "À Propos" : "About Us"}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href={`/${locale}/faq`} className="text-white/70 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-gradus-gold mb-6 border-b border-white/10 pb-2">
              {isFr ? "Légal" : "Legal"}
            </h2>
            <ul className="space-y-4">
              <li><Link href={`/${locale}/privacy`} className="text-white/70 hover:text-white transition-colors">{isFr ? "Politique de Confidentialité" : "Privacy Policy"}</Link></li>
              <li><Link href={`/${locale}/legal`} className="text-white/70 hover:text-white transition-colors">{isFr ? "Mentions Légales" : "Legal Notices"}</Link></li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
