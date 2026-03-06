"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * A large radial spotlight that follows the cursor — gives the "premium dark hero"
 * feel seen on finance/consulting sites. Drop this anywhere inside a dark section.
 */
export default function CursorSpotlight() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { damping: 30, stiffness: 120 });
  const y = useSpring(rawY, { damping: 30, stiffness: 120 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  const bgX = useTransform(x, (v) => `${v}px`);
  const bgY = useTransform(y, (v) => `${v}px`);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 opacity-0 md:opacity-100"
      style={{
        background: "transparent",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(600px circle at var(--cx) var(--cy), rgba(59,130,246,0.07) 0%, transparent 70%)",
          // @ts-ignore
          "--cx": bgX,
          "--cy": bgY,
        } as any}
      />
    </motion.div>
  );
}
