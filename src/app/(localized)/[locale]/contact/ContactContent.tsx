"use client";

import { Suspense } from "react";
import ContactForm from "@/sections/ContactForm";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ContactContent() {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  return (
    <section className="relative flex-grow pt-20 pb-24 md:pt-28 md:pb-36">
      <div className="container w-full">
        <p className="label-utility mb-10 flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          {fr ? "Contact" : "Contact"}
        </p>
        <h1 className="text-display-xl font-display text-text-primary flex flex-col mb-16 md:mb-24">
          <span>{fr ? "Confiez Votre" : "Trust Us With Your"}</span>
          <span className="ml-[4%] md:ml-[8.333%] text-accent">{fr ? "Croissance." : "Growth."}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
          {/* Left: details */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-body text-text-secondary max-w-md mb-12">
              {fr ? 'Nos experts basés à Casablanca transforment votre vision en une véritable suprématie digitale. Remplissez ce formulaire pour initier notre collaboration.' : 'Our Casablanca-based experts transform your vision into true digital supremacy. Fill out this form to initiate our collaboration.'}
            </p>

            <dl>
              <div className="border-t border-gradus-border py-6 grid grid-cols-[8rem_1fr] gap-4 items-baseline">
                <dt className="label-utility">{fr ? 'Siège Social' : 'Headquarters'}</dt>
                <dd className="text-caption text-text-primary">217 Bd Brahim Roudani,<br/>Casablanca 20000, {fr ? 'Maroc' : 'Morocco'}</dd>
              </div>
              <div className="border-t border-gradus-border py-6 grid grid-cols-[8rem_1fr] gap-4 items-baseline">
                <dt className="label-utility">Email</dt>
                <dd><a href="mailto:contact@gradus.ma" className="link-underline text-caption text-text-primary">contact@gradus.ma</a></dd>
              </div>
              <div className="border-t border-b border-gradus-border py-6 grid grid-cols-[8rem_1fr] gap-4 items-baseline">
                <dt className="label-utility">{fr ? 'Ligne Directe' : 'Direct Line'}</dt>
                <dd><a href="tel:+212691404005" className="link-underline text-caption text-text-primary">+212 691 404 005</a></dd>
              </div>
            </dl>

            <div className="mt-10 border border-gradus-border p-1.5">
              <iframe
                title={fr ? "Carte : 217 Bd Brahim Roudani, Casablanca" : "Map: 217 Bd Brahim Roudani, Casablanca"}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.1591750334014!2d-7.644119109520122!3d33.575216204600586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2c4302e5dcf%3A0xe306c07903d33453!2s217%20Bd%20Brahim%20Roudani%2C%20Casablanca%2020250!5e0!3m2!1sen!2sma!4v1774141623070!5m2!1sen!2sma"
                className="w-full h-48 md:h-[220px] grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="label-utility mt-3 flex items-center justify-between">
              <span>Casablanca, MA</span>
              <span>33.57°N — 7.58°W</span>
            </p>
          </div>

          {/* Right: form, one step down */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-16 border-t border-gradus-border pt-10">
            <h2 className="text-heading font-display text-text-primary mb-10">{fr ? 'Décrivez vos objectifs' : 'Describe your objectives'}</h2>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
