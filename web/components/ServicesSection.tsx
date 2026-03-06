"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AnimatedHeading from "@/components/AnimatedHeading";

interface ServicesSectionProps {
  services: any[];
  title?: string;
  subtitle?: string;
}

export default function ServicesSection({ services, title, subtitle }: ServicesSectionProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Interactive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Floating Lines */}
        <motion.div
           animate={{ 
             x: [0, 100, 0],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-0 w-[400px] h-px bg-linear-to-r from-transparent via-primary to-transparent"
        />
        <motion.div
           animate={{ 
             x: [0, -100, 0],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-20 left-0 w-[300px] h-px bg-linear-to-r from-transparent via-primary to-transparent"
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-4"
          >
            {subtitle || "Our Services"}
          </motion.p>
            <AnimatedHeading
              text={title || "Our Services."}
              className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-outfit text-white leading-tight mb-8"
              delay={0.1}
            />
            
            <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-primary mx-auto mt-6 rounded-full"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: any, idx: number) => {
            const serviceSlug = service.slug;
            const servicePath = `/services/${serviceSlug}`;

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white p-6 rounded-2xl border-2 border-[#113264]/20 shadow-sm hover:border-[#113264]/55 hover:shadow-[0_20px_50px_rgba(17,50,100,0.14)] transition-all duration-300 overflow-hidden"
              >
                {/* Individual Card Shimmer */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors font-outfit">{service.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-light">{service.shortDescription}</p>
                  <Link href={servicePath} className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
