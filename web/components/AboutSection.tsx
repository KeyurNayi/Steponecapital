"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface AboutSectionProps {
  data: any;
}

export default function AboutSection({ data }: AboutSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      slidesToScroll: 1
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((emblaApi: any) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  const orb1X = useTransform(springX, (v: number) => v * 0.05);
  const orb1Y = useTransform(springY, (v: number) => v * 0.05);
  const orb2X = useTransform(springX, (v: number) => v * -0.05);
  const orb2Y = useTransform(springY, (v: number) => v * -0.08);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!data) return null;

  const { title, preTitle, description, media, cards = [], ctaLabel, ctaLink } = data;
  
  const mediaData = media?.data ? media.data.attributes : media;
  const imageUrl = mediaData?.url || mediaData?.formats?.large?.url || mediaData?.formats?.medium?.url;
  const finalImageUrl = imageUrl ? getFileUrl(imageUrl) : null;

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]"
        />
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      </div>

      <div className="container px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-bold tracking-widest text-sm uppercase block mb-4">
                {preTitle || "About"}
              </span>
            </motion.div>

            <AnimatedHeading 
              text={title || "Empowering Your Strategic Growth."}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit text-[#113264] leading-[1.2] mb-8 pb-1"
              delay={0.1}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed font-outfit"
            >
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                Array.isArray(description) ? (
                  description.map((block: any, i: number) => (
                    <p key={i}>{block.children?.[0]?.text}</p>
                  ))
                ) : (
                   <p>No description available.</p>
                )
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Link 
                href={ctaLink || "/about"}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/95 hover:shadow-xl hover:scale-105 transition-all group"
              >
                {ctaLabel || "Read More"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative aspect-4/3 w-full max-w-2xl"
          >
            {finalImageUrl ? (
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl group">
                <Image
                  src={finalImageUrl}
                  alt={title || "About Image"}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  loader={({ src }) => src}
                />
                <div className="absolute inset-0 bg-[#113264]/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-[3rem] flex items-center justify-center text-gray-400">
                Image Placeholder
              </div>
            )}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-blue-100 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Full Screen Carousel Section */}
      {cards.length > 0 && (
        <div className="relative pt-12 w-full overflow-hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {cards.map((card: any, idx: number) => {
                const iconData = card.icon?.data ? card.icon.data.attributes : card.icon;
                const iconUrl = iconData?.url ? getFileUrl(iconData.url) : null;

                return (
                  <div 
                    key={card.id || idx} 
                    className="flex-[0_0_100%] min-w-0 flex justify-center px-4 md:px-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="group relative p-6 md:p-10 rounded-[2.5rem] bg-white border border-[#113264]/10 shadow-xs hover:border-primary/30 hover:shadow-2xl transition-all duration-500 w-full max-w-[95%] md:max-w-7xl mx-auto min-h-[300px]"
                    >
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20 h-full">
                        {/* Left Side: Icon/Logo */}
                        <div className="shrink-0">
                          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 bg-[#113264]/5 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                            {iconUrl ? (
                              <Image
                                src={iconUrl}
                                alt={card.title}
                                width={48}
                                height={48}
                                className="object-contain group-hover:invert group-hover:brightness-0 transition-all duration-500 relative z-10 w-8 h-8 md:w-10 md:h-10"
                                loader={({ src }) => src}
                              />
                            ) : (
                              <span className="text-[#113264] group-hover:text-white font-bold text-2xl md:text-3xl font-outfit transition-colors duration-500">
                                {card.title?.[0]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                          <div className="mb-4 md:mb-6 space-y-3">
                            {card.preTitle && (
                              <span className="inline-block text-primary text-[10px] font-black uppercase tracking-[0.2em] bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full">
                                {card.preTitle}
                              </span>
                            )}
                            <h3 className="text-xl md:text-3xl font-bold text-[#113264] font-outfit leading-tight group-hover:text-primary transition-colors duration-300">
                              {card.title}
                            </h3>
                          </div>

                          <div className="text-gray-500 text-lg md:text-xl leading-relaxed md:leading-normal font-outfit font-light line-clamp-5">
                            {typeof card.description === "string"
                              ? card.description
                              : card.description?.[0]?.children?.[0]?.text || ""}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-12 mt-20 pb-12">
            <button 
              onClick={scrollPrev}
              className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:shadow-2xl hover:scale-110 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="flex gap-4">
              {cards.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`h-3 rounded-full transition-all duration-700 ${
                    selectedIndex === idx ? "w-16 bg-primary shadow-lg shadow-primary/30" : "w-3 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={scrollNext}
              className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:shadow-2xl hover:scale-110 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              disabled={!canScrollNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
