import type { ENSProfile, RiskFactor, TrustSignal, RiskReport, SimilarName } from "@/types";

const KNOWN_PUBLIC_RESOLVER = "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63";

export function scoreRisk(
  profile: ENSProfile | null,
  similarNames: SimilarName[]
): { score: number; factors: RiskFactor[]; trustSignals: TrustSignal[] } {
  const factors: RiskFactor[] = [];
  let score = 0;

  // Factor: New registration (< 30 days) — +25
  const isNewRegistration =
    profile?.registrationDate != null &&
    Date.now() - profile.registrationDate.getTime() < 30 * 24 * 60 * 60 * 1000;

  factors.push({
    id: "new_registration",
    label: "Newly Registered",
    description: "This ENS name was registered less than 30 days ago.",
    points: 25,
    triggered: isNewRegistration,
  });
  if (isNewRegistration) score += 25;

  // Factor: No avatar — +10
  const noAvatar = !profile?.avatarUrl;
  factors.push({
    id: "no_avatar",
    label: "No Avatar",
    description: "No avatar is set for this ENS name.",
    points: 10,
    triggered: noAvatar,
  });
  if (noAvatar) score += 10;

  // Factor: No social records — +15
  const socialKeys = ["com.twitter", "com.github", "org.telegram", "url", "email"];
  const hasSocial =
    profile != null &&
    socialKeys.some((k) => profile.textRecords[k]);
  const noSocial = !hasSocial;
  factors.push({
    id: "no_social",
    label: "No Social Records",
    description: "No verified social links (Twitter, GitHub, website) are attached.",
    points: 15,
    triggered: noSocial,
  });
  if (noSocial) score += 15;

  // Factor: No reverse record — +20
  const noReverse = !profile?.hasReverseRecord;
  factors.push({
    id: "no_reverse",
    label: "No Reverse Record",
    description: "The wallet address does not point back to this ENS name.",
    points: 20,
    triggered: noReverse,
  });
  if (noReverse) score += 20;

  // Factor: Homograph attack (Unicode lookalikes) — +40
  const homographMatches = similarNames.filter((s) => s.attackType === "homograph");
  const isHomographAttack = homographMatches.length > 0;
  factors.push({
    id: "homograph_attack",
    label: "Unicode Homograph Attack",
    description: isHomographAttack
      ? `This name uses visually identical Unicode characters to impersonate: ${homographMatches.map((s) => s.name).slice(0, 3).join(", ")}`
      : "No Unicode homograph attack detected.",
    points: 40,
    triggered: isHomographAttack,
  });
  if (isHomographAttack) score += 40;

  // Factor: Typosquatting similarity — +30
  const typoMatches = similarNames.filter((s) => s.attackType === "typo");
  const isTyposquat = typoMatches.length > 0;
  factors.push({
    id: "typosquat",
    label: "Typosquatting Risk",
    description: isTyposquat
      ? `Similar registered ENS names found: ${typoMatches.map((s) => s.name).slice(0, 3).join(", ")}`
      : "No typosquatting variants detected.",
    points: 30,
    triggered: isTyposquat,
  });
  if (isTyposquat) score += 30;

  // Factor: Resolver mismatch — +20
  const resolverMismatch =
    profile?.resolverAddress != null &&
    profile.resolverAddress.toLowerCase() !== KNOWN_PUBLIC_RESOLVER.toLowerCase();
  factors.push({
    id: "resolver_mismatch",
    label: "Non-Standard Resolver",
    description: "This name uses a non-standard or unrecognized ENS resolver.",
    points: 20,
    triggered: resolverMismatch,
  });
  if (resolverMismatch) score += 20;

  // Clamp to 100
  score = Math.min(score, 100);

  // Trust signals
  const trustSignals: TrustSignal[] = buildTrustSignals(profile);

  return { score, factors, trustSignals };
}

function buildTrustSignals(profile: ENSProfile | null): TrustSignal[] {
  if (!profile) return [];

  const age = profile.registrationDate
    ? Date.now() - profile.registrationDate.getTime()
    : 0;
  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
  const THREE_YEARS = 3 * ONE_YEAR;

  return [
    {
      id: "has_avatar",
      label: "Verified ENS Avatar",
      description: "This name has a verified avatar set.",
      active: !!profile.avatarUrl,
    },
    {
      id: "reverse_record",
      label: "Reverse Record Configured",
      description: "The wallet address resolves back to this ENS name.",
      active: profile.hasReverseRecord,
    },
    {
      id: "github",
      label: "GitHub Linked",
      description: "A GitHub profile is linked to this ENS name.",
      active: !!profile.textRecords["com.github"],
    },
    {
      id: "twitter",
      label: "Twitter/X Linked",
      description: "A Twitter/X handle is linked to this ENS name.",
      active: !!profile.textRecords["com.twitter"],
    },
    {
      id: "website",
      label: "Website Linked",
      description: "A website URL is associated with this ENS name.",
      active: !!profile.textRecords["url"],
    },
    {
      id: "one_year",
      label: "Older than 1 Year",
      description: "This ENS name has existed for over 1 year.",
      active: age > ONE_YEAR,
    },
    {
      id: "three_years",
      label: "Older than 3 Years",
      description: "This ENS name has existed for over 3 years — long-standing identity.",
      active: age > THREE_YEARS,
    },
  ];
}

export function buildExplanation(
  score: number,
  factors: RiskFactor[],
  profile: ENSProfile | null
): string {
  const triggered = factors.filter((f) => f.triggered);
  const level = score <= 30 ? "low" : score <= 60 ? "moderate" : "high";

  if (!profile) {
    return "This ENS name could not be resolved. It may not be registered, or there could be a lookup issue. Proceed with extreme caution.";
  }

  if (triggered.length === 0) {
    return "This ENS name appears trustworthy. It has a solid registration history, verified social records, and proper reverse resolution configured.";
  }

  const parts: string[] = [`This ENS name appears ${level} risk.`];

  if (triggered.find((f) => f.id === "new_registration")) {
    parts.push("The domain was registered recently, which is a common pattern in phishing attempts.");
  }
  if (triggered.find((f) => f.id === "homograph_attack")) {
    parts.push(
      "⚠️ This name uses Unicode characters that are visually identical to Latin letters — a sophisticated homograph attack designed to trick users."
    );
  }
  if (triggered.find((f) => f.id === "typosquat")) {
    parts.push("It closely resembles one or more established ENS names — a classic typosquatting pattern.");
  }
  if (triggered.find((f) => f.id === "no_social")) {
    parts.push("No verified social profile records are attached.");
  }
  if (triggered.find((f) => f.id === "no_reverse")) {
    parts.push("The wallet address does not have a reverse record pointing to this name.");
  }
  if (triggered.find((f) => f.id === "no_avatar")) {
    parts.push("No avatar has been set, which is common for freshly created or throwaway names.");
  }
  if (triggered.find((f) => f.id === "resolver_mismatch")) {
    parts.push("This name uses a non-standard resolver, which may indicate a custom or malicious setup.");
  }

  return parts.join(" ");
}

export function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
}

export function buildRiskReport(
  ensName: string,
  profile: ENSProfile | null,
  similarNames: SimilarName[]
): RiskReport {
  const { score, factors, trustSignals } = scoreRisk(profile, similarNames);
  const explanation = buildExplanation(score, factors, profile);
  const riskLevel = getRiskLevel(score);

  return {
    ensName,
    profile,
    riskScore: score,
    riskLevel,
    riskFactors: factors,
    trustSignals,
    similarNames,
    explanation,
  };
}
