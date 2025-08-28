"use client";
import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-none fixed left-0 right-0 -z-10"
      style={{
        // Avoid the top header (approx 4rem) and bottom nav (approx 6-8rem across breakpoints)
        top: "4rem",
        bottom: "7rem",
        background:
          "radial-gradient(60% 50% at 20% 10%, rgba(122,215,255,.12), transparent 60%), radial-gradient(50% 40% at 80% 20%, rgba(167,139,250,.12), transparent 60%), radial-gradient(40% 40% at 50% 90%, rgba(122,215,255,.08), transparent 60%)",
        filter: "blur(20px)",
      }}
    />
  );
} 