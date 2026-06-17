import levenshtein from "fast-levenshtein";
import { lookupENS } from "@/lib/ens/lookup";
import type { SimilarName } from "@/types";

// ---------------------------------------------------------------------------
// 1. CLASSIC TYPOSQUATTING CANDIDATES
//    Techniques: character duplication, omission, replacement, transposition
// ---------------------------------------------------------------------------

function generateTypoCandidates(name: string): string[] {
  const label = name.replace(/\.eth$/, "");
  const candidates = new Set<string>();

  // 1a. Character duplication (double each char)
  for (let i = 0; i < label.length; i++) {
    const dup = label.slice(0, i) + label[i] + label.slice(i);
    candidates.add(dup);
  }

  // 1b. Character omission (remove each char)
  for (let i = 0; i < label.length; i++) {
    if (label.length > 3) {
      const omit = label.slice(0, i) + label.slice(i + 1);
      candidates.add(omit);
    }
  }

  // 1c. Character replacement (ASCII look-alike substitutions)
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

  // 1d. Adjacent key transposition
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

// ---------------------------------------------------------------------------
// 2. UNICODE HOMOGRAPH CANDIDATES
//    Maps visually identical Unicode characters from Cyrillic, Greek,
//    Armenian, and other scripts to their Latin lookalikes.
//    Each entry: Latin char → array of visually identical Unicode chars.
// ---------------------------------------------------------------------------

/**
 * Comprehensive confusables map.
 * Keys are lowercase Latin letters; values are Unicode codepoints that look
 * nearly identical in most fonts.
 *
 * Sources: Unicode Consortium confusables.txt, IDN homograph attack research.
 */
const UNICODE_CONFUSABLES: Record<string, string[]> = {
  a: [
    "\u0430", // Cyrillic а
    "\u0251", // Latin alpha
    "\u00e0", // à
    "\u00e1", // á
    "\u00e2", // â
    "\u0105", // ą (Polish)
  ],
  b: [
    "\u0432", // Cyrillic в (looks like b in some fonts)
    "\u13f4", // Cherokee Ꭼ (approximate)
  ],
  c: [
    "\u0441", // Cyrillic с
    "\u03f2", // Greek lunate sigma
    "\u00e7", // ç
  ],
  d: [
    "\u0501", // Cyrillic d lookalike
    "\u217e", // Roman numeral d (lowercase)
  ],
  e: [
    "\u0435", // Cyrillic е
    "\u0454", // Cyrillic є
    "\u00e8", // è
    "\u00e9", // é
    "\u00ea", // ê
    "\u0119", // ę
  ],
  g: [
    "\u0261", // Latin g (script form)
    "\u011f", // ğ
  ],
  h: [
    "\u04bb", // Cyrillic һ
    "\u0570", // Armenian հ
  ],
  i: [
    "\u0456", // Cyrillic і
    "\u04cf", // Cyrillic ӏ
    "\u00ed", // í
    "\u00ee", // î
    "\u012f", // į
    "\u0131", // ı (dotless i)
  ],
  j: [
    "\u0458", // Cyrillic ј
  ],
  k: [
    "\u03ba", // Greek κ
    "\u043a", // Cyrillic к
  ],
  l: [
    "\u04cf", // Cyrillic ӏ
    "\u0031", // digit 1
    "\u006c", // lowercase L itself (already ASCII but included for completeness)
    "\u217c", // Roman numeral l
  ],
  m: [
    "\u043c", // Cyrillic м
    "\u217f", // Roman numeral m
  ],
  n: [
    "\u0578", // Armenian ո
    "\u043d", // Cyrillic н (partial similarity)
  ],
  o: [
    "\u043e", // Cyrillic о
    "\u03bf", // Greek omicron
    "\u0585", // Armenian օ
    "\u00f2", // ò
    "\u00f3", // ó
    "\u00f4", // ô
    "\u00f6", // ö
    "\u00f8", // ø
    "\u014d", // ō
  ],
  p: [
    "\u0440", // Cyrillic р (looks like p)
    "\u03c1", // Greek rho
    "\u04a7", // Cyrillic ԧ
  ],
  q: [
    "\u0566", // Armenian զ (approximate)
  ],
  r: [
    "\u0433", // Cyrillic г (partial)
    "\u0072", // Latin r (self, redundant)
  ],
  s: [
    "\u0455", // Cyrillic ѕ
    "\u0219", // ș
    "\u015f", // ş
  ],
  t: [
    "\u0442", // Cyrillic т (partial)
    "\u0163", // ţ
    "\u021b", // ț
  ],
  u: [
    "\u0446", // Cyrillic ц (partial)
    "\u00fc", // ü
    "\u00fa", // ú
    "\u00fb", // û
    "\u0169", // ũ
  ],
  v: [
    "\u0475", // Cyrillic ѵ
    "\u03bd", // Greek nu
  ],
  w: [
    "\u0461", // Cyrillic ѡ
    "\u03c9", // Greek omega
  ],
  x: [
    "\u0445", // Cyrillic х
    "\u03c7", // Greek chi
  ],
  y: [
    "\u0443", // Cyrillic у
    "\u00fd", // ý
    "\u03b3", // Greek gamma (partial)
  ],
  z: [
    "\u0225", // Latin z variant
    "\u017c", // ż
    "\u017e", // ž
  ],
};

/**
 * Given an ENS label (without .eth), generates all single-character Unicode
 * homograph substitutions. Returns an array of `.eth` suffixed candidates.
 */
function generateHomographCandidates(name: string): string[] {
  const label = name.replace(/\.eth$/, "").toLowerCase();
  const candidates = new Set<string>();

  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    const confusables = UNICODE_CONFUSABLES[ch];
    if (!confusables) continue;

    for (const lookalike of confusables) {
      // Skip if the lookalike IS the same codepoint (e.g. ASCII self-references)
      if (lookalike === ch) continue;
      const spoofed = label.slice(0, i) + lookalike + label.slice(i + 1);
      candidates.add(spoofed);
    }
  }

  // Remove the original ASCII label
  candidates.delete(label);

  return Array.from(candidates)
    .filter((c) => c.length >= 3)
    .map((c) => `${c}.eth`);
}

// ---------------------------------------------------------------------------
// 3. NORMALISE A NAME TO ASCII FOR DISPLAY / COMPARISON
//    Strips homograph chars back to their ASCII equivalents so we can show
//    the user what the "real" character looks like.
// ---------------------------------------------------------------------------

/** Build reverse map: Unicode confusable → ASCII equivalent */
const CONFUSABLE_TO_ASCII: Map<string, string> = new Map();
for (const [ascii, variants] of Object.entries(UNICODE_CONFUSABLES)) {
  for (const v of variants) {
    CONFUSABLE_TO_ASCII.set(v, ascii);
  }
}

/**
 * Replaces known Unicode confusables in a string with their ASCII equivalents.
 * Useful for showing users: "this name looks like vitalik.eth but uses Cyrillic а"
 */
export function normalizeHomographs(label: string): string {
  return Array.from(label)
    .map((ch) => CONFUSABLE_TO_ASCII.get(ch) ?? ch)
    .join("");
}

/**
 * Returns true if the label contains any Unicode confusable characters.
 */
export function containsHomographChars(label: string): boolean {
  return Array.from(label).some((ch) => CONFUSABLE_TO_ASCII.has(ch));
}

// ---------------------------------------------------------------------------
// 4. MAIN EXPORTS
// ---------------------------------------------------------------------------

export async function findSimilarNames(ensName: string): Promise<SimilarName[]> {
  const label = ensName.replace(/\.eth$/, "");

  // — Typo candidates (Levenshtein-based) —
  const typoCandidates = generateTypoCandidates(ensName);
  const closeTypos = typoCandidates
    .map((c) => ({
      name: c,
      distance: levenshtein.get(label, c.replace(/\.eth$/, "")),
    }))
    .filter((c) => c.distance <= 2 && c.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);

  // — Homograph candidates (Unicode confusables) —
  const homographCandidates = generateHomographCandidates(ensName);
  // Homographs with the same visual length but different codepoints:
  // we use Levenshtein on the *normalised* form so distance is 0 or 1
  const closeHomographs = homographCandidates
    .map((c) => ({
      name: c,
      // Levenshtein of normalised labels — a true homograph has distance 0
      distance: levenshtein.get(
        normalizeHomographs(label),
        normalizeHomographs(c.replace(/\.eth$/, ""))
      ),
    }))
    .filter((c) => c.distance <= 1)
    .slice(0, 8);

  // — Check on-chain existence for both sets —
  const [typoResults, homographResults] = await Promise.all([
    Promise.allSettled(
      closeTypos.map(async ({ name, distance }) => {
        const profile = await lookupENS(name).catch(() => null);
        return {
          name,
          exists: profile?.resolvedAddress != null || profile?.ownerAddress != null,
          registrationDate: profile?.registrationDate ?? null,
          distance,
          attackType: "typo" as const,
        } satisfies SimilarName;
      })
    ),
    Promise.allSettled(
      closeHomographs.map(async ({ name, distance }) => {
        const profile = await lookupENS(name).catch(() => null);
        return {
          name,
          exists: profile?.resolvedAddress != null || profile?.ownerAddress != null,
          registrationDate: profile?.registrationDate ?? null,
          distance,
          attackType: "homograph" as const,
        } satisfies SimilarName;
      })
    ),
  ]);

  const fulfilled = <T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> =>
    r.status === "fulfilled";

  const typos = typoResults.filter(fulfilled).map((r) => r.value).filter((r) => r.exists);
  const homographs = homographResults.filter(fulfilled).map((r) => r.value).filter((r) => r.exists);

  // Deduplicate by name (homograph takes priority if both lists contain it)
  const seen = new Set<string>();
  const merged: SimilarName[] = [];

  for (const h of homographs) {
    if (!seen.has(h.name)) {
      seen.add(h.name);
      merged.push(h);
    }
  }
  for (const t of typos) {
    if (!seen.has(t.name)) {
      seen.add(t.name);
      merged.push(t);
    }
  }

  return merged;
}
