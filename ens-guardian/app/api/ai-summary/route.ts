import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  report: z.object({
    ensName: z.string(),
    riskScore: z.number(),
    riskLevel: z.string(),
    explanation: z.string(),
    riskFactors: z.array(z.object({
      label: z.string(),
      triggered: z.boolean(),
    })),
    similarNames: z.array(z.object({ name: z.string() })),
  }),
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { summary: "AI analysis is not configured. Add OPENAI_API_KEY to enable this feature." },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { report } = parsed.data;
    const triggeredFactors = report.riskFactors
      .filter((f) => f.triggered)
      .map((f) => f.label)
      .join(", ");

    const prompt = `You are a Web3 security expert. Analyze this ENS name risk report and provide a concise 2-3 sentence security summary for a non-technical user.

ENS Name: ${report.ensName}
Risk Score: ${report.riskScore}/100 (${report.riskLevel} risk)
Triggered Risk Factors: ${triggeredFactors || "None"}
Similar Names Found: ${report.similarNames.map((n) => n.name).join(", ") || "None"}

Write a clear, actionable security verdict. Be direct and human-readable. No markdown, no headers.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!res.ok) throw new Error("OpenAI API error");

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content?.trim() ?? "Unable to generate summary.";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[AI Summary] error:", err);
    return NextResponse.json({ summary: "AI analysis is temporarily unavailable." });
  }
}
