"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3";
}

/**
 * Splits heading text into individual words and reveals each with a
 * staggered upward-fade animation triggered when it enters the viewport.
 */
export default function AnimatedHeading({
  text,
  className = "",
  delay = 0,
  tag: Tag = "h2",
}: AnimatedHeadingProps) {
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.075,
        delayChildren: delay,
      },
    },
  };

  const wordVariant: any = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-wrap gap-x-[0.25em] py-[0.1em]"
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span variants={wordVariant} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
