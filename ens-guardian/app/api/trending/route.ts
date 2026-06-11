import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Aggregate searches by query, get average risk score, count, last searched
    const trending = await prisma.search.groupBy({
      by: ["query"],
      _count: { query: true },
      _avg: { riskScore: true },
      _max: { timestamp: true },
      where: {
        riskScore: { not: null },
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      orderBy: [
        { _count: { query: "desc" } },
        { _avg: { riskScore: "desc" } },
      ],
      take: 20,
    });

    type GroupByResult = typeof trending[number];
    const result = trending
      .filter((t: GroupByResult) => (t._avg.riskScore ?? 0) >= 40)
      .map((t: GroupByResult) => ({
        ensName: t.query,
        searchCount: t._count.query,
        avgRiskScore: Math.round(t._avg.riskScore ?? 0),
        lastSearched: t._max.timestamp,
      }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API/trending] error:", err);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
