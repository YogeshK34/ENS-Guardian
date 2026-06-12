import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lookupENS } from "@/lib/ens/lookup";
import { findSimilarNames } from "@/lib/ens/similarity";
import { buildRiskReport } from "@/lib/risk/engine";

const QuerySchema = z.object({
  name: z.string().min(1).max(200),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("name");

  const parsed = QuerySchema.safeParse({ name: raw });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const { name } = parsed.data;

  try {
    const [profile, similarNames] = await Promise.all([
      lookupENS(name),
      findSimilarNames(name.toLowerCase().trim()),
    ]);

    const report = buildRiskReport(name, profile, similarNames);

    return NextResponse.json({
      profile: report.profile,
      riskScore: report.riskScore,
      riskLevel: report.riskLevel,
      trustSignals: report.trustSignals,
      similarNames: report.similarNames,
      explanation: report.explanation,
    });
  } catch (err) {
    console.error("[API/profile] error:", err);
    return NextResponse.json({ error: "Profile lookup failed" }, { status: 500 });
  }
}
