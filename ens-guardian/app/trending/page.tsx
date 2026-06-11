import type { Metadata } from "next";
import { TrendingPageClient } from "./trending-client";

export const metadata: Metadata = {
  title: "Trending Suspicious ENS",
  description: "Most-searched high-risk ENS names this week.",
};

export default function TrendingPage() {
  return <TrendingPageClient />;
}
