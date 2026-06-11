"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/components/search-bar";
import { RiskScoreRing } from "@/components/risk-score-ring";
import { RiskFactorCard } from "@/components/risk-factor-card";
import { TrustSignalBadge } from "@/components/trust-signal-badge";
import { SimilarNamesCard } from "@/components/similar-names-card";
import { ENSProfileCard } from "@/components/ens-profile-card";
import { AnalysisSkeleton } from "@/components/loading-skeleton";
import { Shield, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
import type { RiskReport } from "@/types";

export function AnalyzePage() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name") ?? "";
  const [report, setReport] = useState<RiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchReport = useCallback(async (name: string) => {
    if (!name) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setAiSummary(null);

    try {
      const res = await fetch(`/api/risk?name=${encodeURIComponent(name)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      const data: RiskReport = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nameParam) {
      fetchReport(nameParam);
    }
  }, [nameParam, fetchReport]);

  const fetchAISummary = async () => {
    if (!report) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary);
      }
    } catch {
      setAiSummary("AI summary unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const activeTrustSignals = report?.trustSignals.filter((s) => s.active) ?? [];

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Shield className="h-7 w-7 text-indigo-400" />
            ENS Risk Analyzer
          </h1>
          <p className="text-slate-500 text-sm">
            Enter an ENS name or Ethereum address to analyze
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <SearchBar defaultValue={nameParam} />
        </div>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-6"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-300">Analysis failed</p>
                <p className="text-sm text-slate-400 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {report && !loading && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Score + explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <RiskScoreRing score={report.riskScore} size={140} />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {report.ensName}
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {report.explanation}
                    </p>

                    {/* AI Summary */}
                    {aiSummary ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-xs font-medium text-indigo-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-slate-300">{aiSummary}</p>
                      </motion.div>
                    ) : (
                      <button
                        onClick={fetchAISummary}
                        disabled={aiLoading}
                        className="mt-4 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        {aiLoading ? "Generating AI summary..." : "Generate AI summary"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Trust signals */}
              {activeTrustSignals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                    Trust Signals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.trustSignals.map((signal, i) => (
                      <TrustSignalBadge key={signal.id} signal={signal} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ENS Profile */}
              {report.profile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                    ENS Profile
                  </h3>
                  <ENSProfileCard profile={report.profile} />
                </motion.div>
              )}

              {/* Similar names */}
              {report.similarNames.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                    Similar Registered Names
                  </h3>
                  <SimilarNamesCard names={report.similarNames} />
                </motion.div>
              )}

              {/* Risk Factors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
                  Risk Factors
                </h3>
                <div className="space-y-2">
                  {report.riskFactors.map((factor, i) => (
                    <RiskFactorCard key={factor.id} factor={factor} index={i} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Empty state */}
          {!nameParam && !loading && !report && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="h-20 w-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-indigo-400/50" />
              </div>
              <p className="text-slate-500">Enter an ENS name above to begin analysis</p>
              <p className="text-slate-600 text-sm mt-1">
                Supports .eth names and 0x addresses
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
