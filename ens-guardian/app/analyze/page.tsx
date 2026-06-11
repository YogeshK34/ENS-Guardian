import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalyzePage } from "./analyze-client";

export const metadata: Metadata = {
  title: "Analyze ENS",
  description: "Analyze any ENS name for phishing, typosquatting, and trust signals.",
};

export default function Page() {
  return (
    <Suspense>
      <AnalyzePage />
    </Suspense>
  );
}
