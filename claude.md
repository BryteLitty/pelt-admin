Pelt Product Requirements Document (PRD)

1. Overview

Product Name: PeltTagline: Think Fast, Move Faster.Type: All-crypto fintech solution for user payments, swaps, on/off-ramp, and deposits.

Pelt is a multi-crypto payment and wallet application that enables users to store, send, receive, swap, and cash out their crypto seamlessly. Pelt’s core is designed to power payments internally first, then expand as an infrastructure layer for other businesses to build on top of.

2. Objectives

Build a universal crypto wallet for users.

Enable on-ramp and off-ramp to fiat via mobile money and banks.

Support swaps between different cryptocurrencies.

Provide fast, internal payments (P2P transfers within Pelt).

Design an intuitive UI with a clean, fintech-inspired look based on the Pelt brand colors.

3. Core Features

3.1 Onboarding & Security

Sign-up with phone/email OTP.

Biometric login (Face ID, fingerprint).

Optional passphrase backup for non-custodial wallets (future).

3.2 Wallet & Portfolio

Multi-crypto support: BTC, ETH, USDT, and expandable list.

Portfolio dashboard with total balance in fiat equivalent.

Favorite assets pinning.

3.3 Payments

Send: To username, phone, or QR.

Receive: Generate QR codes or payment links.

Free, instant P2P internal transfers.

Payment requests (“Request 50 USDT from Kofi”).

3.4 On-Ramp & Off-Ramp

Deposit: Buy crypto with mobile money, bank transfer, or debit card.

Withdraw: Cash out crypto to mobile money or bank.

Transparent fee breakdowns.

3.5 Swaps

Cross-crypto swaps (BTC ↔ ETH, ETH ↔ USDT, etc.).

Live rate previews with estimated fees.

3.6 Transaction History

Unified activity feed across all assets.

Filters by asset, type (deposit, swap, cash-out).

Exportable statements.

3.7 Profile & Security

Update PIN, biometrics, 2FA.

Privacy mode (hide balances).

Session/device management.

4. User Flows

Home Screen

Shows total balance (crypto + fiat equivalent).

Quick actions: Send, Receive, Swap, Cash Out, Buy.

Recent activity timeline.

Swap Flow

User selects From asset → To asset.

Input amount, preview result, confirm swap.

On-Ramp (Deposit)

Choose payment method (Momo, Bank, Card).

Select crypto asset.

Confirm with live rates.

Off-Ramp (Cash Out)

Select asset and amount.

Choose destination (Momo, Bank).

Confirm payout with fee breakdown.

5. Design Guidelines

Theme

Use Pelt brand colors for Dark Mode and Light Mode.

Dark Mode (Default)

Background: Deep navy (#0C1021 approx from logo)

Primary Accent: Teal-green (#2CF6C0 approx from logo)

Secondary Accent: White/Light Gray (#F5F5F5)

Highlight: Subtle neon glow effects on active buttons/icons.

Light Mode

Background: White (#FFFFFF)

Text: Dark navy (#0C1021)

Primary Accent: Teal-green (#2CF6C0)

Secondary Accent: Gray (#7D7D7D)

Typography

Headings: Bold sans-serif (Inter or Satoshi).

Body: Clean sans-serif, medium weight.

Numbers: Monospaced option for balances.

Animations

Pulse effect when transactions complete.

Smooth fade transitions between screens.

Micro-interactions on buttons (ripple/pulse).

6. Roadmap (Phased Rollout)

Phase 1 (MVP):

Onboarding & security.

Wallet with BTC, ETH, USDT.

Internal P2P payments.

On/Off-ramp with mobile money & bank.

Basic swaps.

Phase 2:

Expanded asset support.

Advanced swaps & stablecoin pairs.

Exportable statements.

Enhanced portfolio analytics.

Phase 3:

Developer APIs & external integrations.

Advanced merchant tools.

Non-custodial wallet option.

7. Success Metrics

Active monthly users.

Average transaction volume (internal + on/off-ramp).

Number of assets supported.

Conversion success rate (deposit/withdrawal).

User satisfaction (NPS, app reviews).

8. Risks & Considerations

Regulatory: Compliance for on/off-ramp services.

Liquidity: Need sufficient liquidity providers for swaps and ramps.

Security: Custody risk, need strong encryption & monitoring.

UX Complexity: Multi-crypto support must remain simple for users.

