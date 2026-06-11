import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  try {
    const searches = await prisma.search.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      select: {
        id: true,
        query: true,
        timestamp: true,
        riskScore: true,
      },
    });

    return NextResponse.json(searches);
  } catch (err) {
    console.error("[API/history] error:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
