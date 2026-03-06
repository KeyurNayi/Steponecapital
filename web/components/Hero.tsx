"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import MarketCanvas from "@/components/MarketCanvas";

function TickerItem({ sym, base }: { sym: string; base: number }) {
  const [val, setVal] = useState(base);
  const [change, setChange] = useState(0);
  const up = change >= 0;

  useEffect(() => {
    setChange(+(Math.random() * 4 - 2).toFixed(2));
    const id = setInterval(() => {
      const delta = (Math.random() - 0.48) * base * 0.003;
      setVal(v => +(Math.max(1, v + delta)).toFixed(2));
      setChange(+(Math.random() * 6 - 2.8).toFixed(2));
    }, 1200 + Math.random() * 800);
    return () => clearInterval(id);
  }, [base]);

  return (
    <span className="inline-flex items-center gap-2 px-5 py-0.5 border-r border-white/10">
      <span className="text-white/50 text-xs font-mono tracking-wide">{sym}</span>
      <span className="text-white text-xs font-bold font-mono">
        {val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <motion.span
        key={change}
        initial={{ opacity: 0, y: up ? 4 : -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-[11px] font-mono font-bold ${up ? "text-green-400" : "text-red-400"}`}
      >
        {up ? "▲" : "▼"}{Math.abs(change).toFixed(2)}%
      </motion.span>
    </span>
  );
}

function LiveTicker({ tickers }: { tickers: any[] }) {
  if (!tickers || tickers.length === 0) return null;
  const items = [...tickers, ...tickers, ...tickers];
  return (
    <div className="absolute bottom-14 left-0 right-0 overflow-hidden bg-black/40 backdrop-blur-sm border-t border-b border-white/8 py-2">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
        style={{ width: "300%" }}
      >
        {items.map((t, i) => (
          <TickerItem key={`${t.symbol}-${i}`} sym={t.symbol} base={t.baseValue} />
        ))}
      </motion.div>
    </div>
  );
}

interface HeroProps {
  heroData: any;
  tickers: any[];
}

export default function Hero({ heroData, tickers }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Tech Tilt Transforms
  const tiltX = useTransform(springX, (v: number) => v * 0.015);
  const tiltRotateY = useTransform(springX, (v: number) => v * 0.005);
  const tiltRotateX = useTransform(springY, (v: number) => v * -0.005);

  // Mouse Glow Transforms
  const glowX = useTransform(springX, (v: number) => v);
  const glowY = useTransform(springY, (v: number) => v);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 3 + 1,
        d: Math.random() * 5 + 6,
        dl: Math.random() * 8,
        up: Math.random() > 0.5,
        val: (Math.random() * 4 - 1.8).toFixed(2),
        isBinary: Math.random() > 0.7,
        bit: Math.random() > 0.5 ? "1" : "0"
      }))
    );

    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Extract Hero Image
  const heroImageData = heroData?.backgroundImage?.data ? heroData.backgroundImage.data.attributes : heroData?.backgroundImage;
  const heroImageUrl = heroImageData?.url || heroImageData?.formats?.large?.url || heroImageData?.formats?.medium?.url;
  const finalHeroImageUrl = heroImageUrl ? getFileUrl(heroImageUrl) : null;

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-gray-950"
    >
      {/* Background Image with Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: finalHeroImageUrl ? 0.7 : 0 }}
        transition={{ duration: 1.8 }}
        className="absolute inset-0 z-0"
      >
        {finalHeroImageUrl && (
          <Image
            src={finalHeroImageUrl}
            alt={heroData?.title || "Hero Background"}
            fill
            className="object-cover"
            priority
            loader={({ src }) => src}
          />
        )}
      </motion.div>

      {/* Fallback Gradient */}
      {!finalHeroImageUrl && (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-[#0a1e3b] via-[#0d2a4d] to-[#113264]" />
      )}

      {/* Market canvas */}
      <div className="absolute inset-0 z-5 opacity-50">
        <MarketCanvas />
      </div>

      {/* Tech Ornaments */}
      <div className="absolute inset-0 z-10 pointer-events-none">
         <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 left-20 w-10 h-10 border-l border-t border-white/20" />
         <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute top-20 right-20 w-10 h-10 border-r border-t border-white/20" />
         <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} className="absolute bottom-40 left-20 w-10 h-10 border-l border-b border-white/20" />
         <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 3 }} className="absolute bottom-40 right-20 w-10 h-10 border-r border-b border-white/20" />
      </div>

      {/* Scanning Lines */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-[40vw] z-10 pointer-events-none opacity-[0.05]"
        style={{ background: "linear-gradient(to right, transparent, #3b82f6, transparent)" }}
      />
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[20vh] z-10 pointer-events-none opacity-[0.03]"
        style={{ background: "linear-gradient(to bottom, transparent, #3b82f6, transparent)" }}
      />

      {/* Mouse Tracking Glow */}
      <motion.div
        className="absolute hidden md:block w-[1000px] h-[1000px] rounded-full pointer-events-none z-10"
        style={{
          background: "radial-gradient(circle at center, rgba(37,99,235,0.1) 0%, transparent 70%)",
          x: glowX,
          y: glowY,
          left: "calc(50% - 500px)",
          top: "calc(50% - 500px)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute font-mono select-none ${p.up ? "text-emerald-400" : "text-red-400"}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.isBinary ? 11 : 9, opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -100] }}
            transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeOut" }}
          >
            {p.isBinary ? p.bit : (p.up ? "+" : "") + p.val + "%"}
          </motion.div>
        ))}
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] z-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center bottom, rgba(59,130,246,0.2) 0%, transparent 75%)" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 z-15 bg-linear-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-15 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* ── CONTENT (With Subtle Tilt/Parallax) ── */}
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          y: heroY,
          x: tiltX,
          rotateY: tiltRotateY,
          rotateX: tiltRotateX,
        }} 
        className="container relative z-20 px-4 md:px-8 perspective-[1000px]"
      >
        <div className="max-w-4xl relative p-12 border border-white/5 backdrop-blur-[2px] rounded-3xl group">
          {/* Animated Corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/40 group-hover:w-16 group-hover:h-16 transition-all duration-500" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/40 group-hover:w-16 group-hover:h-16 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary/40 group-hover:w-16 group-hover:h-16 transition-all duration-500" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/40 group-hover:w-16 group-hover:h-16 transition-all duration-500" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-[2px] bg-primary/60 shadow-[0_0_10px_#3b82f6]" />
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-6xl md:text-8xl lg:text-7xl xl:text-9xl font-bold text-white leading-[0.95] tracking-tight font-outfit"
            >
              {(heroData?.title || "Capital Advisory").split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? "text-primary text-glow-primary" : ""}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-blue-100/60 mb-12 leading-relaxed font-light max-w-2xl"
          >
            {heroData?.subtitle || "Global strategy powered by deep research and institutional-grade excellence."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-8"
          >
            <Link
              href={heroData?.primaryButtonLink || "/contact"}
              className="group relative px-10 py-5 bg-primary text-white font-bold rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_rgba(59,130,246,0.8)] transition-all duration-500"
            >
              <motion.div
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-y-0 w-20 bg-white/20 -skew-x-12 blur-md"
              />
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider text-sm">
                {heroData?.primaryButtonText || "Get Started"} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </Link>
            <Link
              href={heroData?.secondaryButtonLink || "/about"}
              className="group px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 hover:border-white/40 backdrop-blur-md transition-all duration-500 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-ping" />
              <span className="uppercase tracking-wider text-sm">{heroData?.secondaryButtonText || "Our Story"}</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Live ticker */}
      <LiveTicker tickers={tickers || []} />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/35 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
