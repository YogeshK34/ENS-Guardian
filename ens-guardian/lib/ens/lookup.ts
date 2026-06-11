import { publicClient } from "@/lib/viem";
import { prisma } from "@/lib/prisma";
import type { ENSProfile } from "@/types";
import { normalize } from "viem/ens";
import { isAddress } from "viem";

const CACHE_TTL_HOURS = 6;

export async function lookupENS(nameOrAddress: string): Promise<ENSProfile | null> {
  try {
    // Check if it's an address — do reverse lookup
    if (isAddress(nameOrAddress)) {
      return await reverseResolveAddress(nameOrAddress);
    }

    // Normalize ENS name
    let normalizedName: string;
    try {
      normalizedName = normalize(nameOrAddress.toLowerCase().trim());
    } catch {
      return null;
    }

    // Check cache first
    const cached = await getCachedProfile(normalizedName);
    if (cached) return cached;

    // Fetch from chain
    return await fetchENSProfile(normalizedName);
  } catch (err) {
    console.error("[ENS] lookup error:", err);
    return null;
  }
}

async function fetchENSProfile(name: string): Promise<ENSProfile | null> {
  try {
    // Resolve address
    const resolvedAddress = await publicClient.getEnsAddress({ name }).catch(() => null);

    // Get avatar
    const avatarUrl = await publicClient.getEnsAvatar({ name }).catch(() => null);

    // Get resolver
    const resolverAddress = await publicClient.getEnsResolver({ name }).catch(() => null);

    // Get text records
    const textKeys = ["email", "url", "avatar", "description", "com.twitter", "com.github", "org.telegram"];
    const textRecords: Record<string, string> = {};

    await Promise.allSettled(
      textKeys.map(async (key) => {
        const val = await publicClient.getEnsText({ name, key }).catch(() => null);
        if (val) textRecords[key] = val;
      })
    );

    // Check reverse record
    let hasReverseRecord = false;
    if (resolvedAddress) {
      const reverseName = await publicClient.getEnsName({ address: resolvedAddress as `0x${string}` }).catch(() => null);
      hasReverseRecord = reverseName?.toLowerCase() === name.toLowerCase();
    }

    // Fetch registration / expiry via ENS subgraph (public API)
    const { registrationDate, expiryDate, ownerAddress } = await fetchRegistrationInfo(name);

    const profile: ENSProfile = {
      name,
      ownerAddress: ownerAddress || resolvedAddress || null,
      resolverAddress: resolverAddress || null,
      registrationDate,
      expiryDate,
      avatarUrl: avatarUrl || null,
      resolvedAddress: resolvedAddress || null,
      hasReverseRecord,
      textRecords,
    };

    // Cache result
    await cacheProfile(profile);

    return profile;
  } catch (err) {
    console.error("[ENS] fetchENSProfile error:", err);
    return null;
  }
}

async function fetchRegistrationInfo(name: string): Promise<{
  registrationDate: Date | null;
  expiryDate: Date | null;
  ownerAddress: string | null;
}> {
  try {
    // Use ENS subgraph
    const label = name.split(".")[0];
    const labelHash = await computeLabelHash(label);

    const query = `
      {
        registration(id: "${labelHash}") {
          registrationDate
          expiryDate
          registrant { id }
        }
      }
    `;

    const res = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { registrationDate: null, expiryDate: null, ownerAddress: null };

    const json = await res.json();
    const reg = json?.data?.registration;

    if (!reg) return { registrationDate: null, expiryDate: null, ownerAddress: null };

    return {
      registrationDate: reg.registrationDate ? new Date(Number(reg.registrationDate) * 1000) : null,
      expiryDate: reg.expiryDate ? new Date(Number(reg.expiryDate) * 1000) : null,
      ownerAddress: reg.registrant?.id || null,
    };
  } catch {
    return { registrationDate: null, expiryDate: null, ownerAddress: null };
  }
}

async function computeLabelHash(label: string): Promise<string> {
  // keccak256 of the label
  const { keccak256, toBytes } = await import("viem");
  return keccak256(toBytes(label)).toLowerCase().replace("0x", "");
}

async function reverseResolveAddress(address: string): Promise<ENSProfile | null> {
  try {
    const name = await publicClient.getEnsName({ address: address as `0x${string}` });
    if (!name) return null;
    return fetchENSProfile(name);
  } catch {
    return null;
  }
}

async function getCachedProfile(name: string): Promise<ENSProfile | null> {
  try {
    const cached = await prisma.eNSProfileCache.findUnique({ where: { ensName: name } });
    if (!cached) return null;
    if (cached.expiresAt < new Date()) {
      await prisma.eNSProfileCache.delete({ where: { ensName: name } });
      return null;
    }
    return {
      name: cached.ensName,
      ownerAddress: cached.ownerAddress,
      resolverAddress: cached.resolverAddress,
      registrationDate: cached.registrationDate,
      expiryDate: cached.expiryDate,
      avatarUrl: cached.avatarUrl,
      resolvedAddress: cached.resolvedAddress,
      hasReverseRecord: cached.hasReverseRecord,
      textRecords: (cached.textRecords as Record<string, string>) || {},
    };
  } catch {
    return null;
  }
}

async function cacheProfile(profile: ENSProfile): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000);
    await prisma.eNSProfileCache.upsert({
      where: { ensName: profile.name },
      create: {
        ensName: profile.name,
        ownerAddress: profile.ownerAddress,
        resolverAddress: profile.resolverAddress,
        registrationDate: profile.registrationDate,
        expiryDate: profile.expiryDate,
        avatarUrl: profile.avatarUrl,
        resolvedAddress: profile.resolvedAddress,
        hasReverseRecord: profile.hasReverseRecord,
        textRecords: profile.textRecords as object,
        expiresAt,
      },
      update: {
        ownerAddress: profile.ownerAddress,
        resolverAddress: profile.resolverAddress,
        registrationDate: profile.registrationDate,
        expiryDate: profile.expiryDate,
        avatarUrl: profile.avatarUrl,
        resolvedAddress: profile.resolvedAddress,
        hasReverseRecord: profile.hasReverseRecord,
        textRecords: profile.textRecords as object,
        cachedAt: new Date(),
        expiresAt,
      },
    });
  } catch (err) {
    console.error("[ENS] cache write error:", err);
  }
}
