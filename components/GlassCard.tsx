import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface GlassCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`glass rounded-2xl border bg-transparent transition-all duration-300 ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold text-white">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </motion.div>
  );
} 