"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFileUrl } from "@/lib/strapi";
import MarketCanvas from "./MarketCanvas";

interface BannerProps {
  title?: string;
  description?: string;
  image?: any;
}

export default function Banner({ title, description, image }: BannerProps) {
  const strapiLoader = ({ src }: { src: string }) => src;
  
  // Handle Strapi v5 media object structure (can be top level or nested in data)
  const imageData = image?.data ? image.data.attributes : image;
  const imageUrl = imageData?.url || imageData?.formats?.large?.url || imageData?.formats?.medium?.url;
  const finalImageUrl = imageUrl ? getFileUrl(imageUrl) : null;
  const finalTitle = title;

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 1,
        d: Math.random() * 5 + 6,
        dl: Math.random() * 8,
        up: Math.random() > 0.5,
        val: (Math.random() * 4 - 1.8).toFixed(2),
      }))
    );
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center mb-16 overflow-hidden bg-gray-950 pt-24">
      {/* Background Image with Scale Animation */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        {finalImageUrl && (
          <Image
            loader={strapiLoader}
            src={finalImageUrl}
            alt={finalTitle || "Banner Image"}
            fill
            className="object-cover"
            priority
          />
        )}
      </motion.div>

      {/* Market Canvas Animation */}
      <div className="absolute inset-0 z-5 opacity-40">
        <MarketCanvas />
      </div>

      {/* Floating glowing particles */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute font-mono select-none ${p.up ? "text-emerald-400" : "text-red-400"}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: 10, opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0], y: [0, -80] }}
            transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeOut" }}
          >
            {p.up ? "+" : ""}{p.val}%
           </motion.div>
        ))}
        {particles.slice(0, 10).map((p) => (
          <motion.div
            key={`dot-${p.id}`}
            className={`absolute rounded-full ${p.up ? "bg-emerald-400" : "bg-red-400"}`}
            style={{ left: `${p.x * 0.9 + 5}%`, top: `${p.y * 0.8 + 10}%`, width: p.s, height: p.s, opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -100], scale: [1, 0.5] }}
            transition={{ duration: p.d + 2, delay: p.dl + 2, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 z-15 bg-linear-to-b from-gray-950/20 via-gray-950/40 to-gray-950/80" />
      <div className="absolute inset-0 z-15 bg-linear-to-r from-gray-950/60 via-transparent to-gray-950/60" />
      
      {/* Content Animation */}
      <div className="container relative z-20 flex items-center justify-center h-full">
        {finalTitle && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 1 }}
              className="h-1 bg-primary mx-auto mb-6 rounded-full"
            />
            <h1 className="text-5xl md:text-7xl font-bold text-white font-outfit tracking-tight drop-shadow-2xl">
              {finalTitle}
            </h1>
            {description && (
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-950/90 to-transparent z-15" />
    </section>
  );
}
