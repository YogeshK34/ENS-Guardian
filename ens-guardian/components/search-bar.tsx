"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Shield, Loader2 } from "lucide-react";

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
}

export function SearchBar({ defaultValue = "", large = false }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    startTransition(() => {
      router.push(`/analyze?name=${encodeURIComponent(trimmed)}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 rounded-xl bg-indigo-500/10 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className={`relative flex items-center gap-3 rounded-xl border border-white/10 bg-[#111318] px-4 group-focus-within:border-indigo-500/40 transition-all ${
          large ? "py-4" : "py-3"
        }`}>
          {isPending ? (
            <Loader2 className={`flex-shrink-0 animate-spin text-indigo-400 ${large ? "h-5 w-5" : "h-4 w-4"}`} />
          ) : (
            <Search className={`flex-shrink-0 text-slate-500 group-focus-within:text-indigo-400 transition-colors ${large ? "h-5 w-5" : "h-4 w-4"}`} />
          )}
          <input
            id="ens-search-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter ENS name or 0x address..."
            className={`flex-1 bg-transparent outline-none text-white placeholder-slate-500 ${large ? "text-lg" : "text-sm"}`}
            autoComplete="off"
            spellCheck={false}
          />
          <motion.button
            type="submit"
            disabled={!value.trim() || isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white transition-colors flex-shrink-0"
          >
            <Shield className="h-4 w-4" />
            Analyze
          </motion.button>
        </div>
      </div>
    </form>
  );
}
