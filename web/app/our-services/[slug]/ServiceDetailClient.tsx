"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/components/Banner";
import { getFileUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";

interface ServiceDetailProps {
  service: {
    title: string;
    banner?: {
      title?: string;
      description?: string;
      image?: any;
    };
    segments?: {
      id: number;
      subtitle?: string;
      tagline?: string;
      heading: string;
      content?: string;
      image: any;
      buttonText?: string;
      buttonLink?: string;
      imagePosition: "left" | "right";
    }[];
  };
}

export default function ServiceDetailClient({ service }: ServiceDetailProps) {
  const strapiLoader = ({ src }: { src: string }) => src;

  return (
    <div className="pt-0 min-h-screen pb-24 bg-white font-outfit">
      {/* Dynamic Banner */}
      <Banner 
        title={service.banner?.title || service.title} 
        description={service.banner?.description}
        image={service.banner?.image} 
      />

      {/* Dynamic Segments */}
      {service.segments && service.segments.length > 0 && (
        <section className="py-24">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-24">
            {service.segments.map((segment, idx) => {
              const isImageLeft = segment.imagePosition === "left";
              
              return (
                <div 
                  key={segment.id || idx}
                  className={cn(
                    "flex flex-col gap-12 lg:gap-20 items-center justify-center",
                    isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse",
                    // Subtle alternating background for segments
                    idx % 2 !== 0 ? "bg-gray-50/50 p-8 lg:p-12 rounded-[3rem]" : ""
                  )}
                >
                  {/* Image Block */}
                  <motion.div 
                    initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full lg:w-1/2 relative h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl"
                  >
                    {segment.image ? (
                      <Image 
                        loader={strapiLoader}
                        src={getFileUrl(segment.image.url)}
                        alt={segment.heading}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 italic">
                        Image Placeholder
                      </div>
                    )}
                  </motion.div>

                  {/* Content Block */}
                  <motion.div 
                    initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full lg:w-1/2 flex flex-col"
                  >
                    {segment.subtitle && (
                      <h4 className="text-[#113264] font-bold text-xl uppercase tracking-wider mb-2">
                        {segment.subtitle}
                      </h4>
                    )}
                    
                    {segment.tagline && (
                      <p className="text-sm text-gray-600 font-medium mb-4">
                        {segment.tagline}
                      </p>
                    )}
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-[#113264] mb-6 leading-tight">
                      {segment.heading}
                    </h2>
                    
                    {segment.content && (
                      <div className="prose prose-slate prose-li:marker:text-[#113264] prose-li:font-medium prose-p:text-gray-600 mb-10">
                        {((content: string) => {
                          const elements: React.ReactNode[] = [];
                          let currentList: React.ReactNode[] = [];

                          content.split('\n').forEach((line, idx) => {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                              currentList.push(
                                <li key={`li-${idx}`} className="text-gray-600 font-medium pl-2 leading-relaxed">
                                  {trimmed.substring(2)}
                                </li>
                              );
                            } else {
                              if (currentList.length > 0) {
                                elements.push(
                                  <ul key={`ul-${idx}`} className="list-disc pl-6 mb-6 space-y-3 mt-4">
                                    {currentList}
                                  </ul>
                                );
                                currentList = [];
                              }
                              if (trimmed) {
                                elements.push(
                                  <p key={`p-${idx}`} className="text-gray-600 leading-relaxed mb-6">
                                    {line}
                                  </p>
                                );
                              } else if (idx < content.split('\n').length - 1) {
                                elements.push(<div key={`br-${idx}`} className="h-4" />);
                              }
                            }
                          });

                          if (currentList.length > 0) {
                            elements.push(
                              <ul key="ul-final" className="list-disc pl-6 mb-6 space-y-3 mt-4">
                                {currentList}
                              </ul>
                            );
                          }

                          return elements;
                        })(segment.content)}
                      </div>
                    )}
                    
                    <div>
                      <Link 
                        href={segment.buttonLink || "/contact-us"}
                        className="inline-block border border-[#113264] text-[#113264] px-10 py-3 rounded text-sm font-semibold hover:bg-[#113264] hover:text-white transition-all duration-300"
                      >
                        {segment.buttonText || "Inquiry Now"}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
