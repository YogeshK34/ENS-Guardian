import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lookupENS } from "@/lib/ens/lookup";
import { findSimilarNames } from "@/lib/ens/similarity";
import { buildRiskReport } from "@/lib/risk/engine";
import { prisma } from "@/lib/prisma";

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

    // Store search in DB
    try {
      await prisma.search.create({
        data: {
          query: name,
          riskScore: report.riskScore,
          analysis: {
            create: {
              ensName: name,
              riskScore: report.riskScore,
              isNewRegistration: report.riskFactors.find((f) => f.id === "new_registration")?.triggered ?? false,
              hasAvatar: report.trustSignals.find((s) => s.id === "has_avatar")?.active ?? false,
              hasSocialRecords: report.trustSignals.find((s) => s.id === "github" || s.id === "twitter")?.active ?? false,
              hasReverseRecord: report.trustSignals.find((s) => s.id === "reverse_record")?.active ?? false,
              isTyposquat: report.riskFactors.find((f) => f.id === "typosquat")?.triggered ?? false,
              isHomographAttack: report.riskFactors.find((f) => f.id === "homograph_attack")?.triggered ?? false,
              resolverMismatch: report.riskFactors.find((f) => f.id === "resolver_mismatch")?.triggered ?? false,
              similarNames: similarNames.map((s) => s.name),
              explanation: report.explanation,
            },
          },
        },
      });
    } catch (dbErr) {
      console.error("[API/risk] DB write error:", dbErr);
    }

    return NextResponse.json(report);
  } catch (err) {
    console.error("[API/risk] error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
