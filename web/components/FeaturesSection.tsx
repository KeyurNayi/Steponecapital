"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import { useEffect } from "react";
import AnimatedHeading from "@/components/AnimatedHeading";

interface StrengthItem {
  id: number;
  title: string;
  preTitle?: string;
  description: any;
  icon?: any;
}

interface FeaturesSectionProps {
  data: any;
}

export default function FeaturesSection({ data }: FeaturesSectionProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 60, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 60, stiffness: 150 });

  // Define transforms at top level to avoid Hook Order violations
  const bg1X = useTransform(springX, (v: number) => v * 0.1);
  const bg2X = useTransform(springX, (v: number) => v * 0.2);
  const bg2Y = useTransform(springY, (v: number) => v * 0.1);
  const bg3X = useTransform(springX, (v: number) => v * -0.1);
  const bg3Y = useTransform(springY, (v: number) => v * -0.05);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!data) return null;

  const { heading, subheading, strengths = [] } = data;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: bg1X }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            x: ["-20%", "20%"]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-blue-50/20 via-transparent to-transparent"
        />
        <motion.div
           style={{ 
             x: bg2X, 
             y: bg2Y 
           }}
           animate={{ 
             y: [-100, 100, -100],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-[10%] w-[2px] h-[300px] bg-linear-to-b from-transparent via-primary/30 to-transparent"
        />
        <motion.div
           style={{ 
             x: bg3X, 
             y: bg3Y 
           }}
           animate={{ 
             y: [200, -200, 200],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-0 left-[15%] w-[2px] h-[400px] bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
      </div>

      <div className="container px-4 relative z-10">
        {/* Header (Optional, if used) */}
        {(heading || subheading) && (
          <div className="text-center max-w-3xl mx-auto mb-20">
             {heading && (
               <AnimatedHeading
            text={heading || "Our Core Strengths"}
            className="text-4xl md:text-5xl font-bold font-outfit text-[#113264] mb-4"
            delay={0.1}
          />
             )}
             {subheading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-lg leading-relaxed"
                >
                  {typeof subheading === "string" ? subheading : subheading[0]?.children?.[0]?.text}
                </motion.div>
             )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {strengths.map((item: StrengthItem, idx: number) => {
            const iconData = item.icon?.data ? item.icon.data.attributes : item.icon;
            const iconUrl = iconData?.url ? getFileUrl(iconData.url) : null;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.7, 
                  delay: idx * 0.1, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white p-6 rounded-3xl border-2 border-[#113264]/20 shadow-sm hover:border-[#113264]/55 hover:shadow-[0_20px_50px_rgba(17,50,100,0.14)] transition-all duration-500 overflow-hidden"
              >
                {/* Hover Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-tr from-transparent via-primary/5 to-transparent -skew-x-12 pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-[#113264]/8 flex items-center justify-center mb-3 group-hover:bg-[#113264] group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={item.title}
                        width={24}
                        height={24}
                        className="object-contain group-hover:invert group-hover:brightness-0 group-hover:contrast-100 transition-all duration-500"
                        loader={({ src }) => src}
                      />
                    ) : (
                      <div className="text-[#113264] group-hover:text-white text-lg font-bold font-outfit transition-colors duration-500">
                        {item.title[0]}
                      </div>
                    )}
                  </div>

                  {/* Badge + Title */}
                  <div className="mb-2 space-y-1">
                    {item.preTitle && (
                      <span className="inline-block text-primary text-[8px] font-black uppercase tracking-[0.2em] bg-primary/8 px-2 py-0.5 rounded-md">
                        {item.preTitle}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#113264] font-outfit leading-tight group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Animated Divider */}
                  <div className="w-10 h-[2px] bg-primary/20 group-hover:w-full group-hover:bg-primary/40 transition-all duration-700 rounded-full mb-4" />

                  {/* Description */}
                  <div className="text-gray-400 leading-relaxed font-light text-sm flex-1 line-clamp-4">
                    {typeof item.description === "string"
                      ? item.description
                      : item.description?.[0]?.children?.[0]?.text || "Description coming soon."}
                  </div>
                </div>

                {/* Corner Glow */}
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-primary/8 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Top-left accent dot */}
                <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
