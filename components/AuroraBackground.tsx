"use client";
import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(60% 50% at 20% 10%, rgba(122,215,255,.18), transparent 60%), radial-gradient(50% 40% at 80% 20%, rgba(167,139,250,.18), transparent 60%), radial-gradient(40% 40% at 50% 90%, rgba(122,215,255,.10), transparent 60%)",
        filter: "blur(30px)",
      }}
    />
  );
} 