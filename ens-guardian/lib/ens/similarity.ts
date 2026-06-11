import levenshtein from "fast-levenshtein";
import { lookupENS } from "@/lib/ens/lookup";
import type { SimilarName } from "@/types";

// Techniques: character duplication, omission, replacement, transposition
function generateTypoCandidates(name: string): string[] {
  const label = name.replace(/\.eth$/, "");
  const candidates = new Set<string>();

  // 1. Character duplication (double each char)
  for (let i = 0; i < label.length; i++) {
    const dup = label.slice(0, i) + label[i] + label.slice(i);
    candidates.add(dup);
  }

  // 2. Character omission (remove each char)
  for (let i = 0; i < label.length; i++) {
    if (label.length > 3) {
      const omit = label.slice(0, i) + label.slice(i + 1);
      candidates.add(omit);
    }
  }

  // 3. Character replacement (common look-alike substitutions)
  const lookalikes: Record<string, string[]> = {
    a: ["@", "4"],
    e: ["3"],
    i: ["1", "l", "I"],
    o: ["0"],
    s: ["5", "$"],
    l: ["1", "I", "i"],
    g: ["9"],
    b: ["6"],
    t: ["7"],
    v: ["w"],
    n: ["m"],
  };

  for (let i = 0; i < label.length; i++) {
    const ch = label[i].toLowerCase();
    const alts = lookalikes[ch];
    if (alts) {
      for (const alt of alts) {
        const replaced = label.slice(0, i) + alt + label.slice(i + 1);
        candidates.add(replaced);
      }
    }
  }

  // 4. Adjacent key transposition
  for (let i = 0; i < label.length - 1; i++) {
    const transposed =
      label.slice(0, i) + label[i + 1] + label[i] + label.slice(i + 2);
    candidates.add(transposed);
  }

  // Remove the original
  candidates.delete(label);

  return Array.from(candidates)
    .filter((c) => c.length >= 3)
    .map((c) => `${c}.eth`);
}

export async function findSimilarNames(ensName: string): Promise<SimilarName[]> {
  const label = ensName.replace(/\.eth$/, "");
  const candidates = generateTypoCandidates(ensName);

  // Only check top candidates by Levenshtein distance ≤ 2
  const close = candidates
    .map((c) => ({
      name: c,
      distance: levenshtein.get(label, c.replace(/\.eth$/, "")),
    }))
    .filter((c) => c.distance <= 2 && c.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 15);

  // Check which ones actually exist on-chain
  const results = await Promise.allSettled(
    close.map(async ({ name, distance }) => {
      const profile = await lookupENS(name).catch(() => null);
      return {
        name,
        exists: profile?.resolvedAddress != null || profile?.ownerAddress != null,
        registrationDate: profile?.registrationDate || null,
        distance,
      } satisfies SimilarName;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<SimilarName> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((r) => r.exists);
}
