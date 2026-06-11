"use client";

import { motion } from "framer-motion";
import { Globe, GitFork, AtSign, Calendar, Clock, User, Wallet, FileText } from "lucide-react";
import Image from "next/image";
import type { ENSProfile } from "@/types";

interface ENSProfileCardProps {
  profile: ENSProfile;
}

export function ENSProfileCard({ profile }: ENSProfileCardProps) {
  const formatDate = (d: Date | null | string) => {
    if (!d) return "Unknown";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const truncate = (s: string | null | undefined, len = 16) =>
    s ? `${s.slice(0, 8)}...${s.slice(-6)}` : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-[#111318] p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" unoptimized />
          ) : (
            <User className="h-6 w-6 text-indigo-400" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          {profile.resolvedAddress && (
            <p className="text-sm font-mono text-slate-400 mt-0.5">{truncate(profile.resolvedAddress)}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {profile.textRecords["description"] && (
        <p className="text-sm text-slate-400 border-l-2 border-indigo-500/30 pl-3">
          {profile.textRecords["description"]}
        </p>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoRow icon={<Wallet className="h-4 w-4" />} label="Owner" value={truncate(profile.ownerAddress)} mono />
        <InfoRow icon={<FileText className="h-4 w-4" />} label="Resolver" value={truncate(profile.resolverAddress)} mono />
        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Registered" value={formatDate(profile.registrationDate)} />
        <InfoRow icon={<Clock className="h-4 w-4" />} label="Expires" value={formatDate(profile.expiryDate)} />
      </div>

      {/* Social links */}
      <div className="flex flex-wrap gap-2">
        {profile.textRecords["com.github"] && (
          <SocialLink
            href={`https://github.com/${profile.textRecords["com.github"]}`}
            icon={<GitFork className="h-3.5 w-3.5" />}
            label={profile.textRecords["com.github"]}
          />
        )}
        {profile.textRecords["com.twitter"] && (
          <SocialLink
            href={`https://twitter.com/${profile.textRecords["com.twitter"]}`}
            icon={<AtSign className="h-3.5 w-3.5" />}
            label={`@${profile.textRecords["com.twitter"]}`}
          />
        )}
        {profile.textRecords["url"] && (
          <SocialLink
            href={profile.textRecords["url"]}
            icon={<Globe className="h-3.5 w-3.5" />}
            label={profile.textRecords["url"].replace(/^https?:\/\//, "")}
          />
        )}
      </div>
    </motion.div>
  );
}

function InfoRow({
  icon, label, value, mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500 flex-shrink-0">{icon}</span>
      <span className="text-slate-500 flex-shrink-0">{label}:</span>
      <span className={`text-slate-300 truncate ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1 text-xs text-slate-300 hover:text-white transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}
