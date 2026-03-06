"use client";

import { motion, useSpring, useTransform, useMotionValue, useInView } from "framer-motion";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import AnimatedHeading from "@/components/AnimatedHeading";
import { useEffect, useRef } from "react";

interface Stat {
  label: string;
  value?: string;
  number?: string;
  icon?: any;
}

interface WhoWeAreProps {
  title: string;
  stats: Stat[];
}

function StatValue({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Extract numeric part and suffix (e.g., "200+" -> 200, "+")
  const numericMatch = value.match(/(\d+)/);
  const target = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(numericMatch ? numericMatch[0] : "", "");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const displayText = useTransform(springValue, (latest) => 
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, target, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayText}</motion.span>
      {suffix}
    </span>
  );
}

export default function WhoWeAre({ title, stats }: WhoWeAreProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Define transforms at top level to avoid Hook Order violations
  const pulseX = useTransform(springX, (v: number) => `calc(-50% + ${v * 0.05}px)`);
  const pulseY = useTransform(springY, (v: number) => `calc(-50% + ${v * 0.05}px)`);
  
  // For particles, we can't easily use hooks inside a map, so we either create a sub-component or pre-define hooks.
  // Since there are only 6 particles, we can pre-define.
  const p1X = useTransform(springX, (v: number) => v * (0.02 * (1)));
  const p1Y = useTransform(springY, (v: number) => v * (0.02 * (1)));
  const p2X = useTransform(springX, (v: number) => v * (0.02 * (2)));
  const p2Y = useTransform(springY, (v: number) => v * (0.02 * (2)));
  const p3X = useTransform(springX, (v: number) => v * (0.02 * (3)));
  const p3Y = useTransform(springY, (v: number) => v * (0.02 * (3)));
  const p4X = useTransform(springX, (v: number) => v * (0.02 * (4)));
  const p4Y = useTransform(springY, (v: number) => v * (0.02 * (4)));
  const p5X = useTransform(springX, (v: number) => v * (0.02 * (5)));
  const p5Y = useTransform(springY, (v: number) => v * (0.02 * (5)));
  const p6X = useTransform(springX, (v: number) => v * (0.02 * (6)));
  const p6Y = useTransform(springY, (v: number) => v * (0.02 * (6)));

  const particleTransforms = [
    { x: p1X, y: p1Y },
    { x: p2X, y: p2Y },
    { x: p3X, y: p3Y },
    { x: p4X, y: p4Y },
    { x: p5X, y: p5Y },
    { x: p6X, y: p6Y },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!stats || stats.length === 0) return null;

  const displayTitle = title || "Who We Are ?";

  return (
    <section className="py-24 bg-white overflow-hidden relative border-t border-gray-100">
      {/* Premium Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
           style={{ 
             x: pulseX, 
             y: pulseY 
           }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-linear-to-r from-blue-50 to-indigo-50/30 rounded-full blur-[120px] -z-10"
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{ 
              x: particleTransforms[i].x, 
              y: particleTransforms[i].y,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1,
            }}
            className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        <div className="text-center mb-20">
          <AnimatedHeading
            text={displayTitle}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit text-gray-900 leading-[1.15]"
            delay={0.1}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.slice(0, 8).map((stat: any, idx: number) => {
            const iconUrl = stat.icon?.url || (stat.icon?.data?.attributes?.url);
            const finalIconUrl = iconUrl ? getFileUrl(iconUrl) : null;
            const rawValue = stat.value || stat.number || "0";

            return (
              <motion.div
                key={`${stat.label}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.05,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(17, 50, 100, 0.08)"
                }}
              className="group relative bg-white p-8 pt-10 rounded-3xl border-2 border-[#113264]/20 flex flex-col items-center text-center hover:border-[#113264]/55 hover:shadow-[0_24px_60px_rgba(17,50,100,0.14)] transition-all duration-500 overflow-hidden"
              >
                {/* Shimmer Sweep */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-tr from-transparent via-[#113264]/4 to-transparent -skew-x-12 pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                />

                {/* Corner Accent Lines */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/20 group-hover:border-primary/60 rounded-tl-3xl transition-colors duration-500" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/20 group-hover:border-primary/60 rounded-tr-3xl transition-colors duration-500" />

                {/* Icon Box */}
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#113264]/8 group-hover:bg-[#113264] group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(17,50,100,0.25)] transition-all duration-500 z-10">
                  {finalIconUrl ? (
                    <div className="relative w-8 h-8">
                      <Image 
                        src={finalIconUrl} 
                        alt={stat.label} 
                        fill 
                        className="object-contain group-hover:invert group-hover:brightness-0 group-hover:contrast-100 transition-all duration-500"
                        loader={({ src }) => src}
                      />
                    </div>
                  ) : (
                    <Building2 className="w-6 h-6 text-[#113264] group-hover:text-white transition-colors duration-500" />
                  )}
                </div>

                {/* Animated Number */}
                <div className="relative z-10 mb-1">
                  <div className="text-5xl font-bold text-[#113264] font-outfit tracking-tight group-hover:scale-105 transition-transform duration-500">
                    <StatValue value={rawValue} />
                  </div>
                </div>

                {/* Expanding Accent Bar */}
                <div className="w-8 h-[2px] bg-primary/20 group-hover:w-3/4 group-hover:bg-primary/50 transition-all duration-700 rounded-full my-3 z-10" />

                {/* Label */}
                <div className="relative z-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-[140px] group-hover:text-[#113264]/60 transition-colors duration-500">
                  {stat.label}
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
