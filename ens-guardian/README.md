# ENS Guardian

> **Trust Before You Send.** — Analyze ENS names for phishing, typosquatting, and trust signals before sending crypto.

![ENS Guardian](https://img.shields.io/badge/ENS-Guardian-6366f1?style=for-the-badge&logo=ethereum)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **ENS Lookup** | Resolve owner, avatar, resolver, dates, text records |
| ⚠️ **Typosquatting Detection** | Levenshtein + lookalike character analysis |
| 🛡️ **Risk Engine** | 0–100 custom scoring across 6 risk factors |
| ✅ **Trust Indicators** | Verified avatar, reverse record, GitHub, Twitter, age |
| 📖 **Human Explanations** | Plain-English security verdicts |
| 📈 **Trending Dashboard** | Most-searched risky ENS names (last 7 days) |
| 🕒 **Search History** | Persistent lookup log with scores |
| 🎓 **Security Education** | Typosquatting, homograph attacks, resolver risks |
| 🤖 **AI Summary** | GPT-4o-mini powered security verdict (optional) |

## Tech Stack

- **Frontend**: Next.js 16 App Router · TypeScript · TailwindCSS v4 · shadcn/ui · Framer Motion
- **Web3**: Viem · ENS Public Resolver APIs · ENS Subgraph
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL · Prisma 7
- **AI**: OpenAI GPT-4o-mini (optional)

## Getting Started

### 1. Install dependencies

```bash
cd ens-guardian
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### 3. Set up database

```bash
# Start PostgreSQL and create DB
sudo systemctl start postgresql
psql -U postgres -c "CREATE DATABASE ens_guardian;"
psql -U postgres -c "CREATE USER ens_user WITH PASSWORD 'yourpassword';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ens_guardian TO ens_user;"

# Run migrations
pnpm prisma migrate dev --name init
```

### 4. Start dev server

```bash
pnpm dev
# Open http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `ETH_RPC_URL` | ❌ Optional | Ethereum RPC (defaults to LlamaRPC) |
| `OPENAI_API_KEY` | ❌ Optional | Enables AI risk summaries |

## Risk Scoring

| Factor | Points |
|--------|--------|
| Registered < 30 days | +25 |
| No avatar | +10 |
| No social records | +15 |
| No reverse record | +20 |
| Typosquatting similarity | +30 |
| Non-standard resolver | +20 |

| Score Range | Risk Level |
|-------------|------------|
| 0–30 | 🟢 Low |
| 31–60 | 🟡 Medium |
| 61–100 | 🔴 High |

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `DATABASE_URL` in your Vercel environment variables and deploy.

---

Built for ETHGlobal · MIT License
