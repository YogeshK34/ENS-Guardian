"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, AlertTriangle, TrendingUp, Zap, ChevronRight, Lock, Eye, Search } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

const features = [
  {
    icon: Search,
    title: "ENS Lookup",
    description: "Fetch owner, resolver, registration date, avatar, and all text records in one click.",
    color: "indigo",
  },
  {
    icon: AlertTriangle,
    title: "Typosquatting Detection",
    description: "Generate and check hundreds of lookalike variants using Levenshtein distance analysis.",
    color: "amber",
  },
  {
    icon: Shield,
    title: "Risk Scoring Engine",
    description: "Custom 0–100 risk score based on age, social records, resolver, and similarity signals.",
    color: "violet",
  },
  {
    icon: TrendingUp,
    title: "Trending Suspicious Names",
    description: "Community-driven leaderboard of the most-searched high-risk ENS names this week.",
    color: "rose",
  },
  {
    icon: Eye,
    title: "Trust Indicators",
    description: "Positive signals like verified avatar, GitHub/Twitter links, and account age badges.",
    color: "emerald",
  },
  {
    icon: Lock,
    title: "Security Education",
    description: "Learn how homograph attacks, resolver exploits, and phishing schemes work.",
    color: "sky",
  },
];

const colorMap: Record<string, string> = {
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
};

const exampleWarnings = [
  { icon: "⚠", text: "Similar to vitalik.eth", color: "text-amber-400" },
  { icon: "⚠", text: "Registered 2 days ago", color: "text-red-400" },
  { icon: "⚠", text: "No verified social records", color: "text-amber-400" },
  { icon: "⚠", text: "Reverse record missing", color: "text-red-400" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-8"
          >
            <Shield className="h-3.5 w-3.5" />
            ENS Security Intelligence Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Trust Before{" "}
            <span className="gradient-text">You Send.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Analyze ENS names for phishing, typosquatting, and trust signals before
            sending crypto. Real-time risk scoring powered by on-chain data.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar large />
          </motion.div>

          {/* Quick examples */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-slate-600"
          >
            Try:{" "}
            {["vitalik.eth", "nick.eth", "ens.eth"].map((name) => (
              <Link
                key={name}
                href={`/analyze?name=${name}`}
                className="text-indigo-400/70 hover:text-indigo-300 transition-colors mx-1"
              >
                {name}
              </Link>
            ))}
          </motion.p>
        </div>
      </section>

      {/* Example warning preview */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Analyzing</p>
                <p className="font-mono text-white font-medium">vitalikk.eth</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Risk Score</p>
                  <p className="text-2xl font-bold text-red-400">87</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {exampleWarnings.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className={w.color}>{w.icon}</span>
                  <span className="text-slate-300">{w.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-600">High Risk — Possible phishing name</span>
              <span className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                HIGH RISK
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-3"
            >
              Everything you need to stay safe
            </motion.h2>
            <p className="text-slate-500">
              Built for Web3 users, developers, and security researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const cls = colorMap[feature.color];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass glass-hover rounded-xl p-5"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${cls} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center"
          >
            <Zap className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Analyze your first ENS name for free
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              No sign-up required. Instant results. Stay safe in Web3.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 font-medium text-white transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Start Analyzing
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span>ENS Guardian — Trust Before You Send</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="hover:text-slate-400 transition-colors">Security Guide</Link>
            <Link href="/trending" className="hover:text-slate-400 transition-colors">Trending</Link>
            <Link href="/history" className="hover:text-slate-400 transition-colors">History</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
