# 🛡️ ENS Guardian

> **Trust Before You Send.** — Analyze ENS names for phishing, typosquatting, and trust signals before sending crypto.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What It Does

ENS Guardian helps users identify potentially malicious ENS names **before** sending funds. Enter any `.eth` name or `0x` address and get:

- **Risk Score (0–100)** with human-readable explanation
- **Typosquatting detection** via Levenshtein distance & lookalike analysis
- **Trust signals** — avatar, reverse record, social links, account age
- **On-chain profile** — owner, resolver, registration/expiry dates, text records

---

## Features

| Feature | Description |
|---|---|
| 🔍 ENS Lookup | Resolve owner, avatar, resolver, dates, and text records |
| ⚠️ Typosquatting Detection | Character duplication, omission, replacement, transposition |
| 🛡️ Risk Engine | Custom scoring across 6 risk factors (max 100) |
| ✅ Trust Indicators | Green badges for avatar, reverse record, GitHub, Twitter, age |
| 📖 Human Explanations | Plain-English security verdicts — not just numbers |
| 📈 Trending Dashboard | Most-searched risky ENS names in the last 7 days |
| 🕒 Search History | Persistent lookup log with risk scores |
| 🎓 Security Education | Typosquatting, homograph attacks, resolver risks, best practices |
| 🤖 AI Summary | GPT-4o-mini security verdict (optional) |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, TailwindCSS v4, shadcn/ui, Framer Motion |
| Web3 | Viem, ENS Public Resolver, ENS Subgraph |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL (Neon), Prisma 7 |
| AI | OpenAI GPT-4o-mini (optional) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database ([Neon](https://neon.tech) recommended)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment (first time only!)
cp .env.example .env
```

Now open `.env` and set your `DATABASE_URL` to your Neon connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

> ⚠️ **Do not skip this step.** The default `.env.example` has a placeholder `localhost` URL that will not work.

```bash
# 3. Push schema to database
npx prisma db push

# 4. Generate Prisma client
npx prisma generate

# 5. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ETH_RPC_URL` | ❌ | Ethereum RPC endpoint (defaults to LlamaRPC) |
| `OPENAI_API_KEY` | ❌ | Enables AI-powered risk summaries |

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/lookup?name=` | GET | ENS profile lookup |
| `/api/risk?name=` | GET | Full risk analysis with scoring |
| `/api/profile?name=` | GET | Profile + risk summary |
| `/api/history?limit=` | GET | Recent search history |
| `/api/trending` | GET | Top suspicious ENS names (7d) |
| `/api/ai-summary` | POST | AI-generated security verdict |

---

## Risk Scoring

| Factor | Points |
|---|---|
| Registered < 30 days | +25 |
| No avatar | +10 |
| No social records | +15 |
| No reverse record | +20 |
| Typosquatting similarity | +30 |
| Non-standard resolver | +20 |

| Range | Level |
|---|---|
| 0–30 | 🟢 Low Risk |
| 31–60 | 🟡 Medium Risk |
| 61–100 | 🔴 High Risk |

---

## Project Structure

```
ens-guardian/
├── app/
│   ├── page.tsx              # Landing page
│   ├── analyze/              # Risk analysis page
│   ├── history/              # Search history page
│   ├── trending/             # Trending suspicious ENS
│   ├── learn/                # Security education
│   └── api/                  # Route handlers
├── components/               # UI components
├── lib/
│   ├── ens/lookup.ts         # ENS resolution + caching
│   ├── ens/similarity.ts     # Typosquatting detection
│   ├── risk/engine.ts        # Risk scoring engine
│   ├── prisma.ts             # Database client
│   └── viem.ts               # Ethereum client
├── prisma/schema.prisma      # Database schema
└── types/index.ts            # TypeScript interfaces
```

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `DATABASE_URL` in Vercel environment variables and deploy.

---

MIT License
