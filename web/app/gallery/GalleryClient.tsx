"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import Banner from "@/components/Banner";
import { useState, useEffect } from "react";
import { X, Maximize2, ZoomIn } from "lucide-react";

interface GalleryClientProps {
  items: any[];
  banner?: {
    title?: string;
    description?: string;
    image?: any;
  };
}

export default function GalleryClient({ items, banner }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const strapiLoader = ({ src }: { src: string }) => src;

  const allImages = items.flatMap((item: any) => {
    const images = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []);
    return images.map((imageObj: any, index: number) => {
      return getFileUrl(imageObj?.url || imageObj?.formats?.large?.url || imageObj?.formats?.medium?.url);
    }).filter(Boolean);
  });

  return (
    <div className="pt-0 min-h-screen pb-24 bg-white relative">
      {/* Dynamic Banner */}
      <Banner 
        title={banner?.title || "Media Gallery"} 
        description={banner?.description}
        image={banner?.image} 
      />

      {/* Gallery Grid */}
      <section className="container px-4 py-20">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {allImages.map((imgUrl: string, index: number) => (
            <motion.div
              layout
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setSelectedImage(imgUrl)}
              className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer border-2 border-[#113264]/20 shadow-sm hover:border-[#113264]/55 hover:shadow-[0_30px_60px_-15px_rgba(17,50,100,0.18)] transition-all duration-500"
            >
              <Image 
                loader={strapiLoader}
                src={imgUrl} 
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#113264]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white scale-90 group-hover:scale-100 transition-transform duration-500">
                  <ZoomIn className="w-8 h-8" />
                </div>
              </div>

              {/* Shimmer line */}
              <motion.div
                className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {allImages.length === 0 && (
          <div className="text-center py-32 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50">
            <p className="text-gray-400 font-outfit text-xl">No media items found yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-10 right-10 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full max-w-7xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                loader={strapiLoader}
                src={selectedImage}
                alt="Fullscreen View"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

