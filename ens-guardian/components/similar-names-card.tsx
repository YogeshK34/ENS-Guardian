"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SimilarName } from "@/types";

interface SimilarNamesCardProps {
  names: SimilarName[];
}

export function SimilarNamesCard({ names }: SimilarNamesCardProps) {
  if (names.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-400" />
        <h3 className="font-semibold text-amber-300">
          Found {names.length} Similar Registered Name{names.length > 1 ? "s" : ""}
        </h3>
      </div>
      <div className="space-y-2">
        {names.map((n, i) => (
          <motion.div
            key={n.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-amber-500/5 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-amber-200">{n.name}</span>
              <span className="text-xs text-slate-500">
                distance: {n.distance}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {n.registrationDate && (
                <span className="text-xs text-slate-500">
                  Reg. {new Date(n.registrationDate).toLocaleDateString()}
                </span>
              )}
              <Link
                href={`/analyze?name=${encodeURIComponent(n.name)}`}
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
