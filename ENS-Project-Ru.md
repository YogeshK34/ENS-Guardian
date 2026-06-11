# ENS Guardian - Full Product Specification

## Overview

Build a production-quality web application called **ENS Guardian**.

The goal is to help users identify potentially malicious, suspicious, typo-squatted, or risky ENS names before sending funds.

This is NOT just an ENS lookup tool.

The focus is:

* Security
* Trust
* Reputation
* Risk analysis
* Human-readable warnings

The application should feel like a real startup MVP.

---

# Core User Story

A user wants to send ETH to:

```text
vitalikk.eth
```

ENS Guardian should immediately warn:

```text
⚠ Similar to vitalik.eth

⚠ Registered 2 days ago

⚠ No verified social records

⚠ Reverse record missing

Risk Score: 87/100
```

The user should understand:

* Whether the ENS name is legitimate
* Whether it is suspicious
* Why the score was generated

---

# Tech Stack

Frontend:

* Next.js 15 App Router
* TypeScript
* TailwindCSS
* shadcn/ui
* Framer Motion

Web3:

* Viem
* Wagmi
* ENS Public Resolver APIs

Backend:

* Next.js Route Handlers

Database:

* PostgreSQL
* Prisma

Deployment:

* Vercel

---

# Design Requirements

Theme:

Dark

Style:

* Modern
* Cybersecurity
* Clean
* Professional

Inspirations:

* Stripe
* Linear
* ENS
* Etherscan

No flashy crypto casino styling.

---

# Feature 1 — ENS Lookup

User enters:

```text
vitalik.eth
```

System fetches:

* Owner
* Resolver
* Registration date
* Expiry date
* Avatar
* Address
* Reverse resolution status

Display:

Card layout

---

# Feature 2 — Similar Name Detection

Generate typo candidates.

Examples:

Input:

```text
vitalik.eth
```

Potential malicious variants:

```text
vitalikk.eth
v1talik.eth
vitallik.eth
vltalik.eth
vitaIik.eth
```

Techniques:

* Levenshtein Distance
* Character replacement
* Character duplication
* Character omission

For each candidate:

Check:

* Does ENS exist?
* Registration date

Display:

```text
Found 3 Similar Registered Names
```

Risk indicators.

---

# Feature 3 — Risk Engine

Create custom scoring.

Start score:

```text
0
```

Add points:

New ENS:

Less than 30 days:

+25

No avatar:

+10

No social records:

+15

No reverse record:

+20

Typosquatting similarity:

+30

Resolver mismatch:

+20

Maximum:

100

Display:

Low Risk

0-30

Medium Risk

31-60

High Risk

61-100

---

# Feature 4 — Trust Indicators

Show positive signals.

Examples:

Verified ENS Avatar

Reverse Record Configured

GitHub Linked

Twitter Linked

Website Linked

Older than 1 year

Older than 3 years

Display:

Green badges.

---

# Feature 5 — Human Readable Explanation

Never show only scores.

Generate:

```text
This ENS name appears moderately risky.

The domain was registered recently,
does not contain any verified profile records,
and closely resembles another popular ENS name.
```

Users should understand WHY.

---

# Feature 6 — ENS Profile Viewer

Show:

Name

Address

Avatar

Text Records

Social Links

Website

Description

Resolver

Expiry

Registration Date

---

# Feature 7 — Wallet Resolution

Input:

```text
0x...
```

Attempt reverse lookup.

Display:

```text
Resolved ENS:
vitalik.eth
```

If none:

```text
No ENS configured
```

---

# Feature 8 — Search History

Store recent lookups.

Database:

Searches

Fields:

id

query

timestamp

risk_score

Allow:

Recent searches page.

---

# Feature 9 — Trending Suspicious ENS

Background job:

Track searches.

Display:

Top searched risky ENS names.

Leaderboard page.

---

# Feature 10 — Security Education

Dedicated page:

Examples:

Typosquatting

Homograph attacks

Resolver risks

Phishing

Reverse records

ENS best practices

Purpose:

Demonstrate domain knowledge.

---

# Bonus Feature 1

AI Risk Summary

Use OpenAI API.

Input:

ENS analysis.

Output:

```text
Potential phishing risk detected.
This ENS name was registered recently
and shares strong similarity with
a well-known ENS identity.
```

Keep concise.

---

# Bonus Feature 2

Browser Extension

Future roadmap.

When user visits:

Etherscan

OpenSea

Safe

Display:

Risk score beside ENS names.

DO NOT BUILD NOW.

Document only.

---

# Database Schema

User

Search

RiskAnalysis

ENSProfileCache

Create proper Prisma models.

Use caching.

Avoid hitting ENS APIs excessively.

---

# API Structure

/api/lookup

/api/risk

/api/history

/api/profile

/api/trending

---

# Landing Page

Hero:

"Trust Before You Send."

Subtitle:

Analyze ENS names for phishing,
typosquatting and trust signals.

CTA:

Analyze ENS

---

# Folder Structure

/app

/components

/lib

/lib/ens

/lib/risk

/lib/scoring

/lib/utils

/prisma

/types

/hooks

/actions

---

# Code Quality Rules

STRICTLY FOLLOW:

* TypeScript everywhere
* No any types
* Reusable components
* Server actions where appropriate
* Zod validation
* Prisma best practices
* Proper loading states
* Error boundaries
* Responsive design
* Accessibility

---

# Commit Workflow (IMPORTANT)

After every meaningful milestone STOP and ask for a commit.

Do NOT continue automatically.

Milestones:

1. Project setup
2. Database setup
3. ENS lookup implementation
4. Similarity detection
5. Risk engine
6. Profile viewer
7. Search history
8. Trending dashboard
9. Landing page polish
10. Final QA

After each milestone print:

"Milestone complete.
Please review and commit before I continue."

Wait for confirmation.

This rule is mandatory.

---

# Definition of Success

A judge, recruiter, or ETHGlobal mentor should immediately understand:

"This solves a real ENS security problem."

The project should feel:

* Useful
* Polished
* Security-focused
* Production-ready

rather than a generic ENS demo.

Prioritize quality over feature quantity.

