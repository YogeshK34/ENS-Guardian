import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lookupENS } from "@/lib/ens/lookup";

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

  try {
    const profile = await lookupENS(parsed.data.name);
    if (!profile) {
      return NextResponse.json({ error: "ENS name not found or not registered" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (err) {
    console.error("[API/lookup] error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
