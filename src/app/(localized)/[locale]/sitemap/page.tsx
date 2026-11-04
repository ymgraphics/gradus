import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { Metadata } from "next";
import Link from "next/link";
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
    <main className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <section className="container pt-36 pb-24 md:pt-48 md:pb-36">
        <p className="label-utility mb-6 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          Index
        </p>
        <h1 className="text-display-lg font-display text-text-primary mb-16">
          {isFr ? "Plan du Site" : "Sitemap"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 max-w-4xl">
          {/* Main Pages */}
          <div>
            <h2 className="label-utility border-b border-gradus-border pb-4 mb-6">
              {isFr ? "Pages Principales" : "Main Pages"}
            </h2>
            <ul className="space-y-4 text-heading font-display">
              <li><Link href={`/${locale}/`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">Accueil / Home</Link></li>
              <li><Link href={`/${locale}/about`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">{isFr ? "À Propos" : "About Us"}</Link></li>
              <li><Link href={`/${locale}/blog`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">Blog</Link></li>
              <li><Link href={`/${locale}/contact`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">Contact</Link></li>
              <li><Link href={`/${locale}/faq`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:mt-12">
            <h2 className="label-utility border-b border-gradus-border pb-4 mb-6">
              {isFr ? "Légal" : "Legal"}
            </h2>
            <ul className="space-y-4 text-heading font-display">
              <li><Link href={`/${locale}/privacy`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">{isFr ? "Politique de Confidentialité" : "Privacy Policy"}</Link></li>
              <li><Link href={`/${locale}/legal`} className="link-underline text-text-secondary hover:text-text-primary transition-colors">{isFr ? "Mentions Légales" : "Legal Notices"}</Link></li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
