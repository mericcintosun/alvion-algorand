# Alvion — AI‑Powered DeFi Copilot on Algorand

Alvion is a Turkish‑first, AI‑powered DeFi copilot and agentic rebalancer built on Algorand. It turns natural‑language intents into safe, automated DeFi actions across staking and DEX protocols, continuously monitoring and rebalancing portfolios under explicit security constraints.

- Core promise: “Manage DeFi by speaking Turkish; your AI agent executes safely and optimizes continuously.”
- Primary capabilities: Natural‑language DeFi, agentic rebalancing, portfolio tracking, policy‑guarded safety, Folks Finance liquid staking (xALGO), and Tinyman swaps.

## Contents

- Product story (what we’re building and why)
- Architecture (frontend, backend, blockchain, contracts)
- Safety model (PolicyGuard)
- Features and integrations (Folks, Tinyman)
- Getting started (install, env, run)
- Usage walkthrough
- Roadmap and next steps
- Landing page copy deck
- Contributing and license

## Product Story

### The Problem

DeFi is fragmented and complex; users juggle multiple apps (staking, swaps, portfolio) and jargon (APY, slippage, impermanent loss) and lack Turkish‑native guidance and safety.

### Our Insight

Algorand’s “Agentic Commerce” future needs an AI that can act safely and continuously on behalf of users—not just chat.

### Our Solution

A Turkish‑first AI copilot that understands plain language, plans safe atomic transactions, executes under hard constraints, and keeps portfolios on target over time.

### What Changes for Users

From clicking through arcane UIs to simply stating goals (e.g., “ALGO’larımı faize bağla, riski %5’i aşma”) and approving once.

## Key Features

- AI DeFi Copilot (TR‑first): Execute DeFi actions with plain Turkish.
- Agentic Rebalancer: Continuously monitors allocations; auto‑corrects deviations with small, safe trades.
- PolicyGuard Safety: Transaction group size limits, fee caps, amount ceilings, slippage guard, and banned rekey/close operations.
- DeFi Integrations:
  - Folks Finance: ALGO ↔ xALGO liquid staking
  - Tinyman: Best‑route swaps with slippage protection
- Portfolio Tracking: Real‑time holdings, USD valuation, performance metrics.
- Modern UX: Gradient theme (orange–blue), responsive design, real‑time feedback, Turkish interface.

## Architecture Overview

- Frontend: React + TypeScript (Vite), Tailwind + DaisyUI, wallet adapters (Pera, Defly, Exodus), hooks + context.
- Backend: Node.js + Express with streaming responses, secure CORS, Gemini API for NLU and planning.
- Blockchain: Algorand (AlgoKit TS, ARC‑56 patterns, atomic transaction groups).
- Smart Contracts: PolicyGuard for safety rules and protocol allowlists.
- DeFi Protocols: Folks Finance (xALGO), Tinyman (DEX).

High‑level flow:
Frontend (React) → Backend (Express + Gemini) → Algorand (SDK + AlgoKit) → DeFi Protocols (Folks, Tinyman)

## Safety Model (PolicyGuard)

- maxFeeMicroAlgo: 200,000
- maxAmountMicroAlgo: 1,000,000,000 (1,000 ALGO)
- maxSlippageBps: 50 (0.5%)
- Group size: 2–16 transactions
- Disallowed: Rekey/Close
- Allowlist: Folks Finance, Tinyman only

## Natural‑Language Examples

- “ALGO’larımı faize bağla, riski %5’i aşma.”
- “0.5 ALGO’yu USDC’ye çevir.”
- “Portföyümü %60 ALGO, %40 USDC yap.”

Pipeline: Command parsing (TR) → plan synthesis → preview for user → single approval → atomic execution.

## Repository Structure

- `QuickStartTemplate/projects/QuickStartTemplate-frontend/` — React + TS app (Vite), UI, wallet, AI flows, DeFi services.
- `QuickStartTemplate/projects/QuickStartTemplate-gemini-backend/` — Express + Gemini routes (command parsing, planning).
- `QuickStartTemplate/projects/QuickStartTemplate-contracts/` — AlgoKit TypeScript contracts, `PolicyGuard`, HelloWorld example, deploy configs.

Key frontend modules:

- `src/components/` — transactions, staking, swaps, AI chat, portfolio views.
- `src/services/defi/` — Folks, Tinyman, guard and execution logic.
- `src/services/ai/` — agent command planner and preview.
- `src/services/portfolio/` — indexer integration and asset aggregation.

## Getting Started

Prerequisites: Node 18+, npm/pnpm, Algorand wallet (Pera/Defly/Exodus), required `.env` files.

1. Install dependencies

```bash
# Frontend
cd QuickStartTemplate/projects/QuickStartTemplate-frontend
npm install

# Backend (Gemini)
cd ../QuickStartTemplate-gemini-backend
npm install

# Contracts (optional for now)
cd ../QuickStartTemplate-contracts
npm install
```

2. Environment

- Frontend: copy `.env.template` to `.env` and fill required keys (wallet, API endpoints).
- Backend: copy `env.example` to `.env` and add Gemini API key and CORS origin.

3. Run dev servers

```bash
# Backend
cd QuickStartTemplate/projects/QuickStartTemplate-gemini-backend
npm run dev

# Frontend (new terminal)
cd QuickStartTemplate/projects/QuickStartTemplate-frontend
npm run dev
```

4. Build for production

```bash
# Frontend
cd QuickStartTemplate/projects/QuickStartTemplate-frontend
npm run build

# Backend
cd QuickStartTemplate/projects/QuickStartTemplate-gemini-backend
npm run build
```

Troubleshooting:

- If `npm run dev` fails on frontend, run: `npm install --save-dev @algorandfoundation/algokit-client-generator`
- Ensure `.env` files exist and contain valid keys.

## Usage Walkthrough

1. Connect wallet (Pera/Defly/Exodus).
2. Open AI Copilot, type a natural‑language command in Turkish.
3. Review the generated plan (steps, slippage, fees).
4. Approve once; transactions execute atomically via PolicyGuard constraints.
5. View updated portfolio and performance.

## Roadmap

Phase 1 (MVP) — Completed

- AI chatbot integration, Folks liquid staking, Tinyman swaps, PolicyGuard safety, TR NLU.

Phase 2 (Q2 2024)

- Multi‑asset support (USDT, USDC, additional ASAs)
- Advanced rebalancing algorithms
- Portfolio analytics expansion
- Native mobile apps
- Push notifications

Phase 3 (Q3 2024)

- More protocols (PactFi, legacy Algofi)
- Cross‑chain bridges (ETH, Polygon)
- Institutional features
- Public API

Phase 4 (Q4 2024)

- Predictive analytics
- Personalized auto‑strategies
- Social trading
- ML‑based risk management

## Landing Page Copy (Plug‑and‑Play)

Hero Title: “Manage DeFi in Turkish. Your AI does the rest.”

Subtext: “Stake, swap, and rebalance on Algorand with one approval—safely, automatically.”

Primary CTA: “Try the Copilot”

Secondary CTA: “See How It Works”

Trust Row: “Powered by Algorand • Integrates with Folks Finance & Tinyman”

Feature Cards:

- AI DeFi Copilot: “Say it in Turkish; get a safe, executable plan.”
- Agentic Rebalancer: “Stay on target. Continuous, small corrections.”
- PolicyGuard Safety: “Limits on fees, amounts, and slippage. No rekey/close.”
- Liquid Staking + DEX: “xALGO staking and swaps in one flow.”

How It Works (3 steps):

1. Describe your goal in Turkish
2. Review & approve the plan
3. Watch your portfolio update in real time

Security Highlights:

- Atomic transactions with hard caps
- Allowlisted protocols
- Max fee and slippage guards
- No rekey/close

Roadmap Highlights:

- More ASAs, analytics, mobile, cross‑chain, institutional‑grade features

FAQ:

- Wallets: Pera, Defly, Exodus
- Safety: PolicyGuard enforces strict limits and allowlists
- Slippage: Adjustable within guard rails
- Protocols: Folks Finance, Tinyman (more coming)

## Why Algorand + Alvion

- High throughput, low fees, finality, and composability for agentic commerce.
- ARC standards and atomic groups suit safe, multi‑step AI execution.
- Ecosystem protocols (Folks, Tinyman) give immediate utility with room to scale.

## Contributing

- Propose features via issues (clear intent, user story, acceptance criteria).
- Follow TypeScript, React, and Tailwind best practices.
- Keep Turkish UX first; validate inputs; respect PolicyGuard limits.

## License

Specify a license (e.g., MIT or Apache‑2.0) and add a `LICENSE` file at the repo root.
