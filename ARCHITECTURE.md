## Pelt Web – Architecture & Implementation Blueprint

This document describes the end-to-end system design and a concrete implementation plan to evolve this codebase into a production-ready, fully fledged application. It covers the frontend (this repository), backend services, blockchain integrations, third‑party providers, security, observability, CI/CD, and deployment.

### High-level goals
- Deliver a secure, responsive web app for crypto wallet, buy/sell, send/receive, swap, and card features.
- Support multi-chain assets with portfolio, activity history, KYC, and onramp/offramp flows.
- Provide an auditable backend with robust auth, KMS-managed secrets, and modular blockchain connectors.

---

## 1) Frontend Application (this repo)

Tech: React + Vite + TypeScript + Tailwind, React Router, shadcn/ui primitives.

Key routes/components (observed):
- `features/homepage` – marketing pages
- `features/auth` – login/register/OTP flows (currently scaffolded)
- `features/dashboard` – layout and sub-features
- `features/wallet` – portfolio view, transactions, buy modal
- `features/send`, `features/receive`, `features/swap`, `features/buy`, `features/card`
- Layout: `core/components/layout/Navigation`, `Footer`

Frontend responsibilities:
- Auth UX (email/password, social/OAuth) and session handling
- Wallet UX: balances, portfolio, transactions, send/receive
- Buy/sell/onramp UX (integrate provider widget/SDK)
- Swap UX (cross/within chain via aggregator)
- KYC UX (document upload, status)
- Card UX (virtual card display, controls)

Required additions:
- Global state: lightweight store (Zustand or Redux Toolkit) for auth/session, portfolio cache, settings.
- API client: typed SDK using OpenAPI (or tRPC) to backend.
- Web3 providers via wagmi/viem for EVM; chain-specific clients for Solana, Tron as needed.
- Realtime updates (transactions, prices) via websockets or SSE.
- Error boundaries, retry handlers, and toast notifications.
- i18n and accessibility checks.

Security on frontend:
- Never store long‑lived tokens in localStorage. Prefer httpOnly cookies.
- Protect routes via guards and server session checks.
- Input validation with Zod (already used) and form sanitization.

---

## 2) Backend Services

Recommended architecture: Modular monorepo or multi-service architecture.

Core services:
- Auth & Users Service
  - Email/password with secure hashing (Argon2id), OAuth (Google), optional passkeys.
  - Session management with short‑lived JWTs + refresh or cookie-based sessions.
  - RBAC and feature flags.
- Wallet Service
  - Portfolio, balances, transaction history aggregation from blockchain indexers.
  - Address management (per chain), xpub storage for BTC‑like chains if needed.
  - Monitors deposits (webhooks/cron) and reconciles with onchain events.
- Payments & On/Off‑Ramp Service
  - Integrates with fiat onramp/offramp providers.
  - Tracks orders, quotes, KYC gating, and provider webhooks.
- Swap Service
  - Aggregates swap quotes from DEX aggregators and executes via onchain tx or custodial flow.
- KYC/Compliance Service
  - Manages verification sessions with KYC provider.
  - Stores statuses, PII encryption at rest.
- Notifications Service
  - Email, push/webpush, and webhook dispatch.
- Pricing & Markets Service
  - Pulls market data, 24h changes, and sparkline series for UI.

Implementation notes:
- Use a single API gateway (BFF) that the frontend calls. Internal services can be separate or modular packages.
- Languages: Node.js (NestJS/Fastify) or Go. Prefer NestJS for DX and decorators, with Zod/OpenAPI for schemas.
- Database: PostgreSQL (primary) + Redis (cache, queues) + optional ClickHouse (analytics/events).
- Background jobs: BullMQ/Redis or Cloud Tasks/Workflows.
- Secrets: Cloud KMS + Secret Manager.

---

## 3) Blockchains & Providers

Scope chains and rationale:
- EVM chains: Ethereum, Polygon, BNB Smart Chain, Arbitrum, Optimism, Base
  - Broad wallet support, stable tooling, cheap L2s.
- Solana
  - High throughput, low fees, large retail usage.
- Bitcoin (optional now, roadmap)
  - Custodial or watch‑only tracking first; UTXO handling is distinct.
- Tron (optional)
  - Popular for USDT transfers in certain regions.

RPC/Indexer providers:
- EVM: Alchemy or Infura (RPC, websockets); Blocknative/Alchemy for mempool; Covalent/Moralis/Bitquery for historical indexing if needed.
- Solana: Helius or Triton/QuickNode; indexers like Helius webhooks.
- Bitcoin: Blockstream, Mempool.space API, or QuickNode.
- Webhooks: Blocknative/Alchemy notify, Helius webhooks.

Wallet connectors (non-custodial UX):
- EVM: wagmi + viem with WalletConnect, MetaMask, Coinbase Wallet.
- Solana: @solana/wallet-adapter with Phantom, Solflare.

Custodial vs non-custodial:
- Phase 1: Non-custodial. Users sign with their own wallets. Backend never holds seeds.
- Phase 2 (optional): Custodial or MPC wallet service (Fireblocks, Coinbase Custody, BitGo) for card/offramp flows. Requires stricter compliance and security review.

Address & balance strategy:
- Non-custodial: Track connected addresses per user and read balances via RPC/indexers.
- Custodial: Derive and assign deposit addresses per chain; monitor and credit offchain ledger.

Token lists & metadata:
- EVM: use token lists (Uniswap, CoinGecko) and pin supported assets.
- Solana: token list registry with logo URIs; restrict to curated list.

---

## 4) Feature Implementation Details

Wallet (Portfolio, Activity)
- Non-custodial: Read balances via RPC or indexer APIs; cache in Redis; compute USD value via pricing service.
- Custodial: Maintain internal ledger; reconcile with onchain deposits/withdrawals.
- Realtime: websocket subscriptions for new tx; push updates to UI.

Send/Receive
- Non-custodial: Build/send tx locally with user’s wallet provider; backend provides chain params/fees and address validation.
- Custodial: Backend constructs and signs tx via MPC/HSM and broadcasts; webhook confirms.
- Address validation: checksum, chain prefix, risk screening (via TRM/Chainalysis optional).

Swap
- Integrate aggregators:
  - EVM: 1inch, 0x, Paraswap, Uniswap routing APIs.
  - Solana: Jupiter aggregator.
- Flow: Quote -> Allowance (EVM) -> Build tx (non-custodial via wallet) or server-exec (custodial) -> Track
- Guardrails: slippage, min received, simulation, approvals management.

Buy (Onramp)
- Provider options: MoonPay, Ramp, Transak, Coinbase Pay, Stripe Crypto (region‑dependent).
- Embed provider widget/SDK in `BuyCryptoModal`; pass user KYC status and prefill data.
- Webhooks: capture order status, credit balances (custodial) or mark as completed (non-custodial).

Card
- Requires issuer/program manager (e.g., Stripe Issuing, Marqeta, Adyen Issuing).
- KYC must be completed. If custodial, card spends draw from custodial balances.
- Controls: freeze/unfreeze, spend limits, merchant category restrictions.

KYC/Compliance
- Providers: Persona, Veriff, Onfido, Sumsub.
- Flow: Create verification session -> redirect/iframe -> webhook -> update status.
- Store PII encrypted (field-level) with KMS envelope encryption.

Pricing & Markets
- Provider: CoinGecko/CoinMarketCap/Kaiko.
- Cache prices and 24h changes; backfill for charts.

Notifications
- Email: Resend/SendGrid; Push/Webpush: OneSignal/WebPush; In-app toasts.

---

## 5) Backend Data Model (indicative)

PostgreSQL tables (core):
- users(id, email, password_hash, created_at)
- user_profiles(user_id, name, avatar_url)
- sessions(id, user_id, expires_at, created_at)
- kyc_verifications(id, user_id, provider, status, created_at, updated_at)
- wallets(id, user_id, chain, address, label, created_at)
- custodial_accounts(id, user_id, chain, address/xpub, created_at)
- assets(id, chain, address/token_mint, symbol, decimals, metadata)
- balances(id, user_id, chain, asset_id, amount, updated_at)
- transactions(id, user_id, chain, hash, direction, asset_id, amount, usd_value, status, occurred_at, raw)
- onramp_orders(id, user_id, provider, fiat_amount, asset_id, status, created_at)
- swap_orders(id, user_id, from_asset_id, to_asset_id, quote, status, tx_hash)
- cards(id, user_id, provider, last4, status)

Indexes & constraints for user_id, chain+address uniqueness, and time‑series queries.

---

## 6) APIs and Contracts

BFF (Gateway) endpoints (REST or tRPC):
- Auth: /auth/register, /auth/login, /auth/logout, /auth/session, /auth/oauth/callback
- Users: /me, /me/wallets, /me/kyc
- Wallet: /portfolio, /transactions, /refresh, /chains/:chain/validate-address
- Send: /tx/estimate, /tx/submit (custodial), /tx/status
- Receive: /deposit-address (custodial), /webhooks/deposit
- Swap: /swap/quote, /swap/submit, /swap/status
- Buy: /buy/providers, /buy/session, /webhooks/onramp
- Card: /card, /card/freeze, /card/limits
- Admin: /admin/users, /admin/kyc, /admin/metrics

OpenAPI spec checked into repo; generate a typed client for frontend.

---

## 7) Security & Compliance

- Secrets: Cloud Secret Manager; never in repo. Use KMS for envelope encryption.
- Data at rest: PII columns encrypted; transparent column-level encryption.
- Data in transit: TLS everywhere; HSTS on edge.
- Auth: Argon2id; short‑lived tokens; CSRF protection; device-bound sessions if possible.
- Rate limiting & bot protection: per‑IP and per‑user limits; Turnstile/hCaptcha.
- Audit logs: structured append-only audit table + immutable object storage.
- Compliance: KYC/AML, GDPR/CCPA; data deletion flows; DPA with providers.

---

## 8) Observability

- Logging: structured JSON (pino/winston), centralized (Datadog/ELK).
- Metrics: Prometheus/OpenTelemetry; SLOs for key APIs.
- Tracing: OpenTelemetry traces across services.
- Alerts: on error rate, p95 latency, webhook failures, balance drifts.

---

## 9) CI/CD & Environments

- Environments: dev, staging, prod with separate RPC keys and DBs.
- CI: lint, typecheck, tests, build, Docker image, SBOM, SAST.
- CD: GitHub Actions to deploy to cloud (Fly.io/Render/Vercel for frontend; AWS/GCP/Azure for backend).
- Migrations: Prisma or Drizzle; apply on deploy; rollback strategy.

---

## 10) Deployment Topology

- Frontend: Vercel/Netlify/Cloudflare Pages; environment variables for API_URL, provider keys (public), wagmi chains.
- Backend: Containerized on Fly.io/AWS ECS/GCP Cloud Run. Use managed Postgres (RDS/Cloud SQL), Redis (Elasticache/Memorystore).
- Webhooks: public endpoints with signature verification and replay protection.
- Cron/Workers: Cloud scheduler + queue workers.

---

## 11) Implementation Phases

Phase 0 – Foundations
- Establish repo(s), environments, CI, secrets, lint/type/test baselines.

Phase 1 – Non‑custodial MVP
- Auth (email/password + Google), sessions, protected routes.
- Wallet: connect wallets (EVM + Solana), read balances, show prices.
- Receive: show addresses, track inbound tx via indexer webhooks.
- Buy: integrate onramp widget; record orders.

Phase 2 – Send & Swap
- Send: construct & broadcast via wallets; show fees; confirmations.
- Swap: integrate 1inch/0x and Jupiter; quotes and execution.

Phase 3 – KYC + Card (and optional custodial)
- KYC provider integration and gating.
- Card issuing provider integration; controls page.
- Optional custodial wallet/MPC migration for card/offramp.

Phase 4 – Hardening
- Monitoring, alerts, rate limits, fraud/risk checks.
- Pen‑tests, bug bounties, compliance audits.

---

## 12) Configuration Matrix (env vars, examples)

Frontend
- VITE_API_URL
- VITE_ONRAMP_PROVIDER_KEY (public)
- VITE_WALLETCONNECT_PROJECT_ID

Backend
- DATABASE_URL, REDIS_URL
- SESSION_SECRET, JWT_SECRET
- KMS_KEY_ID, SECRET_MANAGER_PROJECT
- ALCHEMY_API_KEY / INFURA_API_KEY
- HELIUS_API_KEY (Solana)
- ONRAMP_PROVIDER_KEYS (MoonPay/Ramp/Transak)
- SWAP_PROVIDER_KEYS (0x/1inch)
- KYC_PROVIDER_KEY (Persona/Veriff)
- EMAIL_PROVIDER_KEY (Resend/SendGrid)

---

## 13) Frontend Integration Pointers for this repo

- Add a `web3` module:
  - EVM: wagmi config for chains [mainnet, polygon, arbitrum, optimism, base, bsc].
  - Solana: wallet adapter context/provider.
  - Provide hooks: `useBalances`, `useTransactions`, `useSwapQuotes` powered by backend.
- Replace mock data in `features/wallet/Wallet.tsx` with live queries to the backend and a price service.
- Implement protected routes for `/dashboard/*` that check server session.
- Implement `BuyCryptoModal` with chosen onramp provider widget and webhook handling on backend.

---

## 14) Risks & Decisions

- Non‑custodial simplifies custody risk but limits card/offramp without partners.
- Multi‑chain support increases maintenance; start with EVM + Solana, add others later.
- Indexer reliance: prefer multiple providers for redundancy.
- Compliance scope grows with geography; start with regions supported by providers.

---

## 15) Checklist to Production

- Auth hardened, rate limits, session rotation
- KYC fully integrated and gated where required (buy/card)
- Wallet connect(s) tested across browsers/devices
- Onramp and swap flows with error handling and refunds/failures
- Webhook signature verification and retries
- Monitoring, alerts, on‑call runbooks
- Backups, migrations, and disaster recovery tested

---

This blueprint provides the concrete components, providers, and phased plan to implement a secure, feature‑complete crypto application aligned with the current codebase structure.


