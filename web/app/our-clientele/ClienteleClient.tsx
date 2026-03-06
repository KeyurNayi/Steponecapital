"use client";

import { motion } from "framer-motion";
import { Quote, Building2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Banner from "@/components/Banner";
import { getFileUrl } from "@/lib/strapi";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const defaultIndustries = [
  { name: "FMCG", emoji: "🛒" },
  { name: "Cosmetics", emoji: "💄" },
  { name: "Refined Oil", emoji: "🛢️" },
  { name: "Textile", emoji: "🧵" },
  { name: "Pharmaceutical", emoji: "💊" },
  { name: "IT", emoji: "💻" },
  { name: "Chemical", emoji: "⚗️" },
  { name: "Solar", emoji: "☀️" },
  { name: "Electrical", emoji: "⚡" },
];

const testimonials = [
  {
    text: "StepOne Capital's expertise in capital markets was instrumental in the success of our recent IPO. Their professional approach and deep industry insights are unmatched.",
    author: "CEO, Tech Solutions Ltd.",
    category: "IPO Advisory"
  },
  {
    text: "The strategic advisory provided by the team during our corporate restructuring phase was invaluable. They simplified complex regulations and delivered results.",
    author: "Director, Global Infra Group",
    category: "Restructuring"
  },
  {
    text: "Highly professional and ethical merchant bankers. Their commitment to client success and transparent communication builds immense trust.",
    author: "Promoter, Sunrise Energy",
    category: "Capital Markets"
  }
];

interface Industry {
  id?: number;
  name: string;
  icon?: any;
}

interface Testimonial {
  description: string;
  companyName: string;
  position?: string;
  image?: any;
}

interface ClienteleClientProps {
  banner?: {
    title?: string;
    description?: string;
    image?: any;
  };
  pageTitle?: string;
  industries?: Industry[];
  industriesSectionTitle?: string;
  testimonials?: Testimonial[];
}

export default function ClienteleClient({ banner, pageTitle, industries, industriesSectionTitle, testimonials: apiTestimonials }: ClienteleClientProps) {
  const strapiLoader = ({ src }: { src: string }) => src;
  const displayIndustries = (industries && industries.length > 0) ? industries : defaultIndustries;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "center", loop: true, skipSnaps: false, duration: 20 },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <div className="pt-0 min-h-screen pb-24 bg-white">
      {/* Dynamic Banner */}
      <Banner 
        title={banner?.title || pageTitle || "Our Clientele"} 
        description={banner?.description}
        image={banner?.image} 
      />

      {/* Dynamic Testimonials / Client Feedback */}
      {apiTestimonials && apiTestimonials.length > 0 && (
        <section className="relative min-h-[85vh] flex flex-col justify-center py-20 bg-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[100px] -ml-20 -mb-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#113264 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="container relative z-10 px-4 md:px-8 text-center mb-16">
            {/* <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-[#113264] font-outfit mb-6"
            >
              Client Feedback
            </motion.h2> */}
            {/* <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "128px" }}
              viewport={{ once: true }}
              className="h-1.5 bg-primary mx-auto rounded-full" 
            /> */}
          </div>

          <div className="max-w-[95vw] mx-auto relative z-10 px-4 md:px-8">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {apiTestimonials.map((testi, idx) => {
                  const imageObj = testi.image?.data ? testi.image.data.attributes : testi.image;
                  const imageUrl = imageObj?.url ? getFileUrl(imageObj.url) : null;

                  return (
                    <div
                      key={idx}
                      className="flex-[0_0_100%] md:flex-[0_0_85%] lg:flex-[0_0_75%] pl-8 min-w-0"
                    >
                      <motion.div
                        animate={{ 
                          scale: idx === selectedIndex ? 1 : 0.95,
                          opacity: idx === selectedIndex ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row bg-white border border-[#113264]/10 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 min-h-[500px] w-full mx-auto overflow-hidden rounded-4xl"
                      >
                        {/* Image Side */}
                        <div className="relative w-full md:w-1/2 min-h-[300px] bg-slate-100 select-none">
                          {imageUrl ? (
                             <Image 
                               loader={strapiLoader}
                               src={imageUrl} 
                               alt={testi.companyName} 
                               fill 
                               className="object-cover pointer-events-none" 
                             />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-100">
                               <span className="text-gray-400 font-medium">No Image</span>
                             </div>
                          )}
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-left relative">
                          <div className="absolute top-10 right-10 opacity-5">
                            <Quote size={120} className="text-[#113264]" />
                          </div>
                          
                          <Quote className="w-12 h-12 text-primary mb-6" />
                          <p className="text-[#333] text-xl md:text-2xl lg:text-3xl leading-relaxed mb-10 select-text italic font-outfit relative z-10">
                            {testi.description}
                          </p>
                          
                          <div className="mt-4 border-l-4 border-primary pl-6 relative z-10">
                            <h4 className="font-bold text-[#113264] text-xl md:text-2xl mb-0.5">{testi.companyName}</h4>
                            {testi.position && (
                              <span className="text-primary font-medium text-base uppercase tracking-wider">{testi.position}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center mt-12 gap-6">
              <button
                onClick={scrollPrev}
                className="group relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#113264]/20 text-[#113264] hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
                <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </button>
              
              <div className="flex items-center gap-2 px-4">
                {apiTestimonials.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      i === selectedIndex ? "w-8 bg-primary" : "w-1.5 bg-[#113264]/20"
                    }`} 
                  />
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="group relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#113264]/20 text-[#113264] hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
                <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      )}
     
      {/* Clients Across Industries */}
      <section className="py-24 bg-gray-50/50 border-t border-blue-100/40">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-4"
            >
              {/* Sectors We Serve */}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#113264] font-outfit"
            >
              {industriesSectionTitle || "Clients Across Industries"}
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-1 bg-primary mx-auto mt-6 rounded-full"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {displayIndustries.map((industry: any, idx: number) => {
              const iconData = industry.icon?.data ? industry.icon.data.attributes : industry.icon;
              const iconUrl = iconData?.url ? getFileUrl(iconData.url) : null;

              return (
                <motion.div
                  key={industry.id || idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-3xl border-2 border-[#113264]/20 shadow-sm hover:border-[#113264]/55 hover:shadow-[0_20px_50px_rgba(17,50,100,0.14)] transition-all duration-500 overflow-hidden cursor-default"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/20 group-hover:border-primary/60 rounded-tl-3xl transition-colors duration-500" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/20 group-hover:border-primary/60 rounded-br-3xl transition-colors duration-500" />

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#113264]/6 group-hover:bg-[#113264]/10 transition-colors duration-500">
                    {iconUrl ? (
                      <Image
                        loader={strapiLoader}
                        src={iconUrl}
                        alt={industry.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-2xl" role="img" aria-label={industry.name}>
                        {industry.emoji || "🏭"}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-sm font-bold text-[#113264] font-outfit tracking-wide group-hover:text-primary transition-colors duration-300 text-center">
                    {industry.name}
                  </span>

                  {/* Bottom glow */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      
    </div>
  );
}
