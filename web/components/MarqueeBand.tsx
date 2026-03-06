"use client";

import { motion } from "framer-motion";

interface MarqueeBandProps {
  items?: string[];
}

const defaultItems = [
  "IPO Advisory",
  "Corporate Restructuring",
  "Capital Markets",
  "Fund Raising",
  "Transaction Advisory",
  "SME Listing",
  "Asset Management",
  "Investment Banking",
  "Merchant Banking",
  "NBFC Services",
];

/**
 * A continuously scrolling horizontal marquee band showing services/keywords.
 * Duplicated 3x to ensure seamless infinite loop.
 */
export default function MarqueeBand({ items = defaultItems }: MarqueeBandProps) {
  const tripled = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden bg-[#113264] py-4 border-y border-white/10">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#113264] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-[#113264] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
        style={{ width: "300%" }}
      >
        {tripled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-8">
            {/* Diamond separator */}
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
            <span className="text-white/80 text-sm font-bold font-outfit uppercase tracking-[0.15em] whitespace-nowrap">
              {item}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
