"use client";

import { motion } from "framer-motion";
import Banner from "@/components/Banner";

interface InvestorsClientProps {
  banner?: {
    title?: string;
    description?: string;
    image?: any;
  };
  pageTitle?: string;
  introText?: string;
}

export default function InvestorsClient({ banner, pageTitle, introText }: InvestorsClientProps) {
  return (
    <div className="pt-0 min-h-screen pb-24 bg-white font-outfit">
      {/* Dynamic Banner */}
      <Banner 
        title={banner?.title || pageTitle || "Investors"} 
        description={banner?.description}
        image={banner?.image} 
      />

      {/* Intro Text Section */}
      {introText && (
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto text-center font-outfit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-base mx-auto text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: introText }}
            />
          </div>
        </section>
      )}

      {/* Placeholder for future Investor sections */}
      <section className="container px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto border-t border-gray-100 pt-12">
          {/* We can add more sections here as per requirement */}
        </div>
      </section>
    </div>
  );
}
