export interface ENSProfile {
  name: string;
  ownerAddress: string | null;
  resolverAddress: string | null;
  registrationDate: Date | null;
  expiryDate: Date | null;
  avatarUrl: string | null;
  resolvedAddress: string | null;
  hasReverseRecord: boolean;
  textRecords: Record<string, string>;
}

export interface SimilarName {
  name: string;
  exists: boolean;
  registrationDate: Date | null;
  distance: number;
  /** "typo" = classic Levenshtein variant; "homograph" = Unicode lookalike attack */
  attackType: "typo" | "homograph";
}

export interface RiskFactor {
  id: string;
  label: string;
  description: string;
  points: number;
  triggered: boolean;
}

export interface TrustSignal {
  id: string;
  label: string;
  description: string;
  active: boolean;
}

export interface RiskReport {
  ensName: string;
  profile: ENSProfile | null;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  riskFactors: RiskFactor[];
  trustSignals: TrustSignal[];
  similarNames: SimilarName[];
  explanation: string;
  aiSummary?: string;
}

export type RiskLevel = "low" | "medium" | "high";

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: Date;
  riskScore: number | null;
}

export interface TrendingEntry {
  ensName: string;
  searchCount: number;
  avgRiskScore: number;
  lastSearched: Date;
}

export interface LookupResult {
  profile: ENSProfile | null;
  error?: string;
}
