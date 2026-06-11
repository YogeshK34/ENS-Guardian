"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { TrendingEntry } from "@/types";

export function TrendingPageClient() {
  const [entries, setEntries] = useState<TrendingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const getRiskColor = (score: number) => {
    if (score <= 30) return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (score <= 60) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return "Low";
    if (score <= 60) return "Medium";
    return "High";
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm text-rose-300 mb-6"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Updated live
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Trending <span className="gradient-text-danger">Suspicious ENS</span>
          </h1>
          <p className="text-slate-500">
            Most-searched high-risk ENS names in the last 7 days
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 shimmer" />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-20">
            <Shield className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No trending data yet.</p>
            <p className="text-slate-600 text-sm mt-1">Start analyzing ENS names to populate this list.</p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry, i) => {
              const colors = getRiskColor(entry.avgRiskScore);
              return (
                <motion.div
                  key={entry.ensName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#111318] glass-hover px-5 py-4"
                >
                  {/* Rank */}
                  <span className="text-2xl font-bold text-slate-700 w-8 flex-shrink-0 text-center">
                    {i + 1}
                  </span>

                  {/* Icon */}
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-medium text-white truncate">{entry.ensName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {entry.searchCount} search{entry.searchCount !== 1 ? "es" : ""} ·{" "}
                      Last: {new Date(entry.lastSearched).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Risk badge */}
                  <div className={`flex-shrink-0 rounded-lg border px-3 py-1 ${colors.bg} ${colors.border}`}>
                    <p className={`text-xs font-medium ${colors.text}`}>{getRiskLabel(entry.avgRiskScore)} Risk</p>
                    <p className={`text-lg font-bold ${colors.text} text-center`}>{entry.avgRiskScore}</p>
                  </div>

                  {/* Analyze link */}
                  <Link
                    href={`/analyze?name=${encodeURIComponent(entry.ensName)}`}
                    className="flex-shrink-0 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
