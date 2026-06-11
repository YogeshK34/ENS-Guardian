"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { RiskFactor } from "@/types";

interface RiskFactorCardProps {
  factor: RiskFactor;
  index: number;
}

export function RiskFactorCard({ factor, index }: RiskFactorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        factor.triggered
          ? "border-red-500/20 bg-red-500/5"
          : "border-emerald-500/20 bg-emerald-500/5"
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${
        factor.triggered ? "text-red-400" : "text-emerald-400"
      }`}>
        {factor.triggered ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-medium ${
            factor.triggered ? "text-red-300" : "text-emerald-300"
          }`}>
            {factor.label}
          </span>
          {factor.triggered && (
            <span className="flex-shrink-0 text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
              +{factor.points}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{factor.description}</p>
      </div>
    </motion.div>
  );
}
