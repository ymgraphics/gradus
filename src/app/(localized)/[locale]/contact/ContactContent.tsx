"use client";

import { Suspense } from "react";
import ContactForm from "@/sections/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ContactContent() {
  const { lang } = useLanguage();
  return (
    <section className="relative flex-grow flex items-center py-20 overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradus-gold/10 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/3 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradus-orange/10 rounded-full blur-[80px] md:blur-[100px] translate-y-1/3 -translate-x-1/3 mix-blend-screen" />
      </div>

      <div className="container relative z-10 w-full px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[50px] md:text-[80px] leading-[1] font-display font-black tracking-normal mb-6 text-white">
              {lang === 'fr' ? 'Confiez Votre' : "Trust Us With Your"} <br/>
              <span className="text-gradus-gold italic font-light">{lang === 'fr' ? 'Croissance.' : 'Growth.'}</span>
            </h1>
            
            <p className="text-lg text-gradus-muted mb-12 max-w-md">
              {lang === 'fr' ? 'Nos experts basés à Casablanca transforment votre vision en une véritable suprématie digitale. Remplissez ce formulaire pour initier notre collaboration.' : 'Our Casablanca-based experts transform your vision into true digital supremacy. Fill out this form to initiate our collaboration.'}
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradus-gold shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-heading font-bold mb-1">{lang === 'fr' ? 'Siège Social' : 'Headquarters'}</h4>
                  <p className="text-gradus-muted text-sm">217 Bd Brahim Roudani,<br/>Casablanca 20000, {lang === 'fr' ? 'Maroc' : 'Morocco'}</p>
                </div>
              </div>

              <div className="w-full h-48 md:h-[200px] rounded-xl overflow-hidden border border-white/10 relative mt-2 group">
                <div className="absolute inset-0 bg-gradus-primary/20 pointer-events-none z-10 group-hover:bg-transparent transition-colors duration-500" />
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.1591750334014!2d-7.644119109520122!3d33.575216204600586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2c4302e5dcf%3A0xe306c07903d33453!2s217%20Bd%20Brahim%20Roudani%2C%20Casablanca%2020250!5e0!3m2!1sen!2sma!4v1774141623070!5m2!1sen!2sma" 
                  className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradus-gold shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-white font-heading font-bold mb-1">Email</h4>
                  <a href="mailto:contact@gradus.ma" className="text-gradus-muted hover:text-white transition-colors text-sm">contact@gradus.ma</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradus-gold shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-white font-heading font-bold mb-1">{lang === 'fr' ? 'Ligne Directe' : 'Direct Line'}</h4>
                  <a href="tel:+212691404005" className="text-gradus-muted hover:text-white transition-colors text-sm">+212 691 404 005</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="bg-gradus-surface/60 backdrop-blur-xl border border-gradus-border p-8 md:p-12 rounded-[32px]">
            <h3 className="text-2xl font-heading font-bold text-white mb-8">{lang === 'fr' ? 'Décrivez vos objectifs' : 'Describe your objectives'}</h3>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>

        </div>
      </div>
    </section>
  );
}
