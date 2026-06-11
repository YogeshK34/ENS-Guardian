"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import type { TrustSignal } from "@/types";

interface TrustSignalBadgeProps {
  signal: TrustSignal;
  index: number;
}

export function TrustSignalBadge({ signal, index }: TrustSignalBadgeProps) {
  if (!signal.active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5"
      title={signal.description}
    >
      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
      <span className="text-xs font-medium text-emerald-300">{signal.label}</span>
    </motion.div>
  );
}
