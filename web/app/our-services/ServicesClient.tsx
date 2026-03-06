"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/components/Banner";
import { getFileUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";

interface ServicesClientProps {
  banner?: {
    title?: string;
    description?: string;
    image?: any;
  };
  pageTitle?: string;
  advisorySection?: {
    heading: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: any;
  };
  serviceOfferings?: {
    id: number;
    heading: string;
    description?: string;
    cards: {
      id: number;
      title: string;
      image: any;
    }[];
  }[];
  allServices?: any[];
}

export default function ServicesClient({ 
  banner, 
  pageTitle, 
  advisorySection,
  serviceOfferings = [],
  allServices = []
}: ServicesClientProps) {
  const strapiLoader = ({ src }: { src: string }) => src;

  return (
    <div className="pt-0 min-h-screen pb-24 bg-white font-outfit">
      {/* Dynamic Banner */}
      <Banner 
        title={banner?.title || pageTitle || "Our Services"} 
        description={banner?.description}
        image={banner?.image} 
      />

{/* Service Categories Grid */}
      {allServices && allServices.length > 0 && (
        <section className="py-24 bg-gray-50/50">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.map((service, idx) => (
                <Link 
                  href={`/our-services/${service.slug}`} 
                  key={service.documentId || idx}
                  className="group flex flex-col items-center"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="w-full relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-all duration-300"
                  >
                    {service.listImage?.url || service.banner?.image?.url ? (
                      <Image 
                        loader={strapiLoader}
                        src={getFileUrl(service.listImage?.url || service.banner.image.url)}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-[#113264] text-center font-outfit px-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Service Offerings (Highlight Sections) */}
      {serviceOfferings && serviceOfferings.length > 0 && (
        <div className="flex flex-col">
          {serviceOfferings.map((section, sIdx) => (
            <section key={section.id || sIdx} className={cn("py-20", sIdx % 2 !== 0 ? "bg-gray-50/30" : "bg-white")}>
              <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto mb-16 px-4">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl font-bold text-[#113264] mb-4 leading-tight"
                    >
                      {section.heading}
                    </motion.h2>
                  {section.description && (
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-base text-gray-600 leading-relaxed"
                      >
                        {section.description}
                      </motion.p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cards.map((card, idx) => (
                    <motion.div 
                      key={card.id || idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg mb-6">
                        {card.image ? (
                          <Image 
                            loader={strapiLoader}
                            src={getFileUrl(card.image.url)}
                            alt={card.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#113264] text-center">
                        {card.title}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      

      {/* SME / Advisory Section (From Strapi Component) */}
      {advisorySection && (
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative h-[500px] rounded-4xl overflow-hidden shadow-2xl"
              >
                {advisorySection.image ? (
                  <Image 
                    loader={strapiLoader}
                    src={getFileUrl(advisorySection.image.url)}
                    alt={advisorySection.heading || "Advisory"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 italic">
                    Image Placeholder
                  </div>
                )}
              </motion.div>

              {/* Content Side */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2"
              >
                  <h2 className="text-2xl md:text-3xl font-bold text-[#113264] mb-6 leading-tight">
                    {advisorySection.heading}
                  </h2>
                  <div 
                    className="text-gray-600 text-base leading-relaxed mb-8 prose prose-slate"
                    dangerouslySetInnerHTML={{ __html: advisorySection.description }}
                  />
                <Link 
                  href={advisorySection.buttonLink || "/contact"}
                  className="inline-block border-2 border-[#113264] text-[#113264] px-12 py-4 rounded-lg font-bold hover:bg-[#113264] hover:text-white transition-all duration-300 text-lg"
                >
                  {advisorySection.buttonText || "Inquiry Now"}
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
