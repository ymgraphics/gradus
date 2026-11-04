import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.legal.title,
    description: dict.seo.legal.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/legal`,
    },
  };
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <section className="container pt-36 pb-24 md:pt-48 md:pb-36">
        <p className="label-utility mb-6 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          Légal
        </p>
        <h1 className="text-display-lg font-display text-text-primary mb-12 max-w-4xl">
          Mentions légales
        </h1>
        <div className="md:ml-[8.333%] max-w-2xl border-t border-gradus-border pt-10 space-y-6 text-body text-text-secondary">
          <p>
            Gradus Agency est une agence créative et marketing digital basée à Casablanca, Maroc.
          </p>
          <p>
            Adresse : 217 Bd Brahim Roudani, Casablanca 20000, Maroc.
          </p>
          <p>
            Contact : contact@gradus.ma · +212 691 404 005.
          </p>
          <p>
            L’ensemble des contenus, visuels, marques et projets présentés sur ce site appartiennent à leurs propriétaires respectifs et sont utilisés à des fins de présentation du portfolio Gradus.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
