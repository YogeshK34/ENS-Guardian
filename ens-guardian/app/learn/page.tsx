import type { Metadata } from "next";
import { Shield, AlertTriangle, Eye, Lock, Link2, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Education",
  description: "Learn about ENS security risks: typosquatting, homograph attacks, resolver exploits, and best practices.",
};

const topics = [
  {
    icon: AlertTriangle,
    color: "amber",
    title: "Typosquatting",
    description:
      "Attackers register ENS names that are visually similar to popular identities — e.g., `vitalikk.eth` vs `vitalik.eth`. The extra letter is easy to miss when copy-pasting or reading quickly.",
    tips: [
      "Always double-check the exact spelling before sending.",
      "Verify the resolved address matches what you expect.",
      "Use ENS Guardian to scan before every transfer.",
    ],
    example: {
      legit: "vitalik.eth",
      fake: "vitalikk.eth",
    },
  },
  {
    icon: Eye,
    color: "rose",
    title: "Homograph Attacks",
    description:
      "Unicode characters can look identical to ASCII letters. For example, the Cyrillic 'а' (U+0430) looks exactly like the Latin 'a'. Attackers exploit this to create visually identical but technically different ENS names.",
    tips: [
      "ENS normalizes names but some bypasses exist.",
      "Always verify the raw hex of the name if possible.",
      "Trust wallets that display normalized ENS names.",
    ],
    example: {
      legit: "ens.eth (Latin)",
      fake: "еns.eth (Cyrillic е)",
    },
  },
  {
    icon: Link2,
    color: "violet",
    title: "Resolver Risks",
    description:
      "ENS names can use custom resolvers that override normal address resolution. A malicious resolver could return a different address than the one the owner set, redirecting your funds.",
    tips: [
      "Only trust names using the official ENS Public Resolver.",
      "Be suspicious of names with unknown or custom resolvers.",
      "Check the resolver address in ENS Guardian.",
    ],
    example: {
      legit: "0x231b0ee14048e9dCcd1d247744d114a4EB5E8E63 (Public Resolver)",
      fake: "0xdeadbeef... (Unknown resolver)",
    },
  },
  {
    icon: Shield,
    color: "red",
    title: "Phishing via ENS",
    description:
      "Scammers create fake ENS names mimicking known protocols (e.g., `uniswap-v4.eth`, `aave-rewards.eth`) and share them in Discord/Telegram DMs to trick users into approving malicious contracts.",
    tips: [
      "Never click ENS links from DMs or unsolicited messages.",
      "Official protocol ENS names are well-documented.",
      "Verify on the protocol's official website.",
    ],
    example: {
      legit: "uniswap.eth",
      fake: "uniswap-airdrop.eth",
    },
  },
  {
    icon: Lock,
    color: "sky",
    title: "Reverse Records",
    description:
      "A reverse record lets a wallet address point back to an ENS name. Legitimate identities typically have this configured. Its absence doesn't confirm malice, but its presence is a positive trust signal.",
    tips: [
      "Look for the 'Reverse Record Configured' badge.",
      "Ask the recipient to set up a reverse record.",
      "Absence of a reverse record adds to the risk score.",
    ],
    example: {
      legit: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 → vitalik.eth",
      fake: "0xdeadbeef... → no reverse record",
    },
  },
  {
    icon: BookOpen,
    color: "indigo",
    title: "ENS Best Practices",
    description:
      "Following these practices will significantly reduce your risk when using ENS names for transfers, contract interactions, and identity verification.",
    tips: [
      "Always analyze unknown names with ENS Guardian before sending.",
      "Prefer names older than 1 year with social records attached.",
      "Verify the resolved address in a block explorer.",
      "Use hardware wallets for large transfers.",
      "Check expiry dates — expired names can be re-registered by attackers.",
    ],
    example: null,
  },
];

const colorMap: Record<string, { icon: string; card: string; badge: string }> = {
  amber: {
    icon: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    card: "border-amber-500/10",
    badge: "bg-amber-500/10 text-amber-300",
  },
  rose: {
    icon: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    card: "border-rose-500/10",
    badge: "bg-rose-500/10 text-rose-300",
  },
  violet: {
    icon: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    card: "border-violet-500/10",
    badge: "bg-violet-500/10 text-violet-300",
  },
  red: {
    icon: "text-red-400 bg-red-500/10 border-red-500/20",
    card: "border-red-500/10",
    badge: "bg-red-500/10 text-red-300",
  },
  sky: {
    icon: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    card: "border-sky-500/10",
    badge: "bg-sky-500/10 text-sky-300",
  },
  indigo: {
    icon: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    card: "border-indigo-500/10",
    badge: "bg-indigo-500/10 text-indigo-300",
  },
};

export default function LearnPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            ENS Security Guide
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Stay Safe in{" "}
            <span className="gradient-text">Web3</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Understanding ENS security risks is the first step to protecting your assets.
            Learn how attackers exploit ENS and how to identify red flags.
          </p>
        </div>

        {/* Topics */}
        <div className="space-y-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const colors = colorMap[topic.color];
            return (
              <div
                key={topic.title}
                className={`rounded-xl border bg-[#111318] p-6 ${colors.card}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-lg border flex items-center justify-center ${colors.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white mb-2">{topic.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {topic.description}
                    </p>

                    {/* Example */}
                    {topic.example && (
                      <div className="mb-4 rounded-lg bg-black/40 border border-white/5 p-3 text-xs font-mono">
                        <p className="text-emerald-400 mb-1">✓ Legitimate: {topic.example.legit}</p>
                        <p className="text-red-400">✗ Suspicious: {topic.example.fake}</p>
                      </div>
                    )}

                    {/* Tips */}
                    <ul className="space-y-1.5">
                      {topic.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className={`mt-0.5 flex-shrink-0 text-xs font-bold ${colors.badge.split(" ")[1]}`}>→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center">
          <Shield className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Put your knowledge to use
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Use ENS Guardian to analyze any name before you send.
          </p>
          <a
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all"
          >
            Analyze ENS Name →
          </a>
        </div>
      </div>
    </div>
  );
}
