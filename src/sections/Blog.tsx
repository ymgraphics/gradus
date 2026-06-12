"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    title: "Stages of developing a corporate identity and logo",
    category: "Création",
    date: "12 Oct 2025",
  },
  {
    title: "Brands belonging to a specific thematic group",
    category: "Style",
    date: "28 Sep 2025",
  },
  {
    title: "How to create a modern logo that attracts customers?",
    category: "Création",
    date: "14 Sep 2025",
  },
  {
    title: "Drawing identity elements on branded media",
    category: "Style",
    date: "02 Sep 2025",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 md:py-32 bg-gradus-surface border-t border-gradus-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <h2 className="text-[40px] md:text-[60px] leading-tight font-display font-bold tracking-normal text-white">
            Du Bureau <br />
            <span className="text-gradus-gold italic font-light">Gradus.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-gradus-primary rounded-[20px] p-6 border border-gradus-border interactive hover:border-gradus-gold hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-full aspect-video bg-white/5 rounded-[12px] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-gradus-primary to-transparent opacity-50 z-10" />
                <div className="absolute inset-0 bg-gradus-gold/5 group-hover:scale-110 transition-transform duration-700" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gradus-gold bg-gradus-gold/10 px-2 py-1 rounded-sm">
                  {post.category}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gradus-muted">
                  {post.date}
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white group-hover:text-gradus-gold transition-colors mb-6 leading-snug">
                {post.title}
              </h3>

              <div className="mt-auto flex items-center justify-between text-sm font-medium text-white/50 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                Lire l&apos;article
                <ArrowUpRight className="w-4 h-4 group-hover:text-gradus-gold transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
