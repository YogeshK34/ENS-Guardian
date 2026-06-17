"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { SimilarName } from "@/types";

interface SimilarNamesCardProps {
  names: SimilarName[];
}

const homographCount = (names: SimilarName[]) =>
  names.filter((n) => n.attackType === "homograph").length;

const typoCount = (names: SimilarName[]) =>
  names.filter((n) => n.attackType === "typo").length;

export function SimilarNamesCard({ names }: SimilarNamesCardProps) {
  if (names.length === 0) return null;

  const hasHomograph = homographCount(names) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-xl border p-5 ${
        hasHomograph
          ? "border-red-500/30 bg-red-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        {hasHomograph ? (
          <ShieldAlert className="h-5 w-5 text-red-400" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        )}
        <h3
          className={`font-semibold ${
            hasHomograph ? "text-red-300" : "text-amber-300"
          }`}
        >
          Found {names.length} Similar Registered Name{names.length > 1 ? "s" : ""}
        </h3>
      </div>

      {/* Sub-summary */}
      <div className="flex flex-wrap gap-2 mb-4">
        {homographCount(names) > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
            <ShieldAlert className="h-3 w-3" />
            {homographCount(names)} Unicode Homograph{homographCount(names) > 1 ? "s" : ""}
          </span>
        )}
        {typoCount(names) > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            {typoCount(names)} Typosquat{typoCount(names) > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Name rows */}
      <div className="space-y-2">
        {names.map((n, i) => {
          const isHomograph = n.attackType === "homograph";
          return (
            <motion.div
              key={n.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                isHomograph
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-amber-500/10 bg-amber-500/5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-sm truncate ${
                    isHomograph ? "text-red-200" : "text-amber-200"
                  }`}
                  title={n.name}
                >
                  {n.name}
                </span>

                {/* Attack type badge */}
                {isHomograph ? (
                  <span
                    className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-red-300 bg-red-500/15 border border-red-500/25 px-1.5 py-0.5 rounded"
                    title="Uses visually identical Unicode characters (e.g. Cyrillic а instead of Latin a)"
                  >
                    <ShieldAlert className="h-2.5 w-2.5" />
                    Homograph
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wide text-amber-400/70 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                    Typo
                  </span>
                )}

                <span className="text-xs text-slate-500 shrink-0">
                  dist: {n.distance}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.registrationDate && (
                  <span className="text-xs text-slate-500">
                    Reg.&nbsp;{new Date(n.registrationDate).toLocaleDateString()}
                  </span>
                )}
                <Link
                  href={`/analyze?name=${encodeURIComponent(n.name)}`}
                  aria-label={`Analyze ${n.name}`}
                  className={`transition-colors ${
                    isHomograph
                      ? "text-red-400 hover:text-red-300"
                      : "text-amber-400 hover:text-amber-300"
                  }`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explainer for homograph attacks */}
      {hasHomograph && (
        <p className="mt-4 text-xs text-red-300/70 leading-relaxed border-t border-red-500/10 pt-3">
          ⚠️ <strong>Homograph attack detected.</strong> One or more names above
          use Unicode characters (e.g. Cyrillic &ldquo;а&rdquo;) that are visually
          indistinguishable from Latin letters. These are sophisticated phishing
          attempts — always verify the address before sending funds.
        </p>
      )}
    </motion.div>
  );
}
