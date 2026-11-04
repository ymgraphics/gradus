import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.privacy.title,
    description: dict.seo.privacy.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/privacy`,
    },
  };
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <section className="container pt-36 pb-24 md:pt-48 md:pb-36">
        <p className="label-utility mb-6 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          Légal
        </p>
        <h1 className="text-display-lg font-display text-text-primary mb-12 max-w-4xl">
          Politique de confidentialité
        </h1>
        <div className="md:ml-[8.333%] max-w-2xl border-t border-gradus-border pt-10 space-y-6 text-body text-text-secondary">
          <p>
            Gradus utilise les informations envoyées via ses formulaires uniquement pour répondre aux demandes de contact, gérer les inscriptions newsletter et améliorer ses services.
          </p>
          <p>
            Les données collectées peuvent inclure le nom, l’adresse email, le sujet, le message et les informations techniques nécessaires à la sécurité du site. Elles ne sont pas vendues à des tiers.
          </p>
          <p>
            Pour demander l’accès, la correction ou la suppression de vos données, contactez-nous à contact@gradus.ma.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
