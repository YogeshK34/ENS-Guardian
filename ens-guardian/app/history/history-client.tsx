"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import type { SearchHistoryEntry } from "@/types";

export function HistoryPageClient() {
  const [entries, setEntries] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history?limit=30")
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const getRiskStyle = (score: number | null) => {
    if (score === null) return { text: "text-slate-500", label: "—" };
    if (score <= 30) return { text: "text-emerald-400", label: `${score}` };
    if (score <= 60) return { text: "text-amber-400", label: `${score}` };
    return { text: "text-red-400", label: `${score}` };
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <History className="h-8 w-8 text-indigo-400" />
            Search History
          </h1>
          <p className="text-slate-500">Recent ENS lookups and their risk scores</p>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 shimmer" />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No searches yet.</p>
            <p className="text-slate-600 text-sm mt-1">
              <Link href="/analyze" className="text-indigo-400 hover:underline">
                Start analyzing
              </Link>{" "}
              ENS names to build your history.
            </p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 divide-y divide-white/5">
              {/* Header */}
              <div className="col-span-4 grid grid-cols-[1fr_auto_auto_auto] gap-4 bg-white/5 px-5 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">ENS Name</span>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 text-right">Risk</span>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 text-right">When</span>
                <span className="text-xs text-slate-500"></span>
              </div>

              {/* Rows */}
              {entries.map((entry, i) => {
                const risk = getRiskStyle(entry.riskScore);
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="col-span-4 grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors"
                  >
                    <span className="font-mono text-sm text-white truncate">{entry.query}</span>
                    <span className={`text-sm font-semibold font-mono text-right ${risk.text}`}>
                      {risk.label}
                    </span>
                    <span className="text-xs text-slate-500 text-right whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <Link
                      href={`/analyze?name=${encodeURIComponent(entry.query)}`}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
