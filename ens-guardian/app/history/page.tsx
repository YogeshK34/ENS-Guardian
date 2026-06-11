import type { Metadata } from "next";
import { HistoryPageClient } from "./history-client";

export const metadata: Metadata = {
  title: "Search History",
  description: "Recent ENS name lookups and risk scores.",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
