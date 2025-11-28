# Bounty Board — Smart Contract Integration

## Project Title
Bounty Board — On-chain task and reward marketplace

## Contract Address
`0xB61aCB4e6bA06CE5ef0c0846FE7b806670E9a747`  
View on Coston2 Explorer: https://coston2-explorer.flare.network/address/0xB61aCB4e6bA06CE5ef0c0846FE7b806670E9a747
<img width="1918" height="1078" alt="image" src="https://github.com/user-attachments/assets/a97be204-f5de-4e0e-9d31-0a2fe45b2d22" />


## Description
This project provides a minimal front-end integration with an on-chain Bounty Board smart contract deployed on the Coston2 (Flare) testnet. The contract enables users to create bounties with an attached reward (payable), allow hunters to apply for bounties, let bounty creators mark tasks as completed, and permit hunters to claim rewards once conditions are met.

The repository contains:
- A TypeScript/React hook (`useBountyContract`) that wraps common contract interactions (read/write) while keeping wallet gating, loading and error handling intact.
- A sample UI component demonstrating how to create bounties, apply as a hunter, mark completion (creator), and claim rewards (hunter).
- The contract address and ABI used by the front-end.

## Features
- **Create bounty (payable)**: Any connected wallet can create a bounty by providing a description and sending the reward value with the transaction.
- **Apply as hunter**: Users can apply to an existing bounty on-chain.
- **Mark completed (creator-only action)**: The bounty creator can mark a bounty as completed once the task is verified.
- **Claim reward**: The hunter (or designated address) can claim the reward for a completed bounty.
- **Transaction lifecycle handling**:
  - Pending / confirming / confirmed states are surfaced to the UI.
  - Errors from contract calls are captured and displayed.
- **Wallet gating**: All actions require the user to connect a wallet; the UI shows connect prompts when disconnected.
- **Best-effort read support**: The hook reads the total bounty count and provides a best-effort approach to list or compute balances when possible.

## How It Solves
### Problem
Traditional task marketplaces often rely on centralized escrow/trust. That introduces counterparty risk, delays, and fees. Developers and communities need a transparent, non-custodial way to post tasks, lock rewards, and let contributors claim payments when work is completed.

### Solution
This project puts bounties and rewards on-chain:
- **Trustless escrow** — reward funds are stored in the contract when the bounty is created. No third-party handling is required.
- **Auditability** — all bounty events (creation, applications, completion, reward claims) are recorded on-chain, providing an immutable audit trail.
- **Permissioned flows** — creators control marking completion; hunters can claim funds only after completion.
- **Use cases**:
  - Open-source bug bounties and funds for reproducible issues.
  - Task marketplaces for design, content, or micro-tasks where the reward is locked until verification.
  - Community bounties for feature work, moderation tasks, or small paid contributions.

### Benefits
- **Transparency**: Clear on-chain records of who created, who applied, and who claimed rewards.
- **No custodial risk**: Funds are held by the contract until claimed under the contract's logic.
- **Composability**: The contract and front-end can be extended to add reputation, off-chain verification, or multisig approvals.
- **Developer-friendly**: A ready-to-use hook and example UI accelerate integration into dApps or dashboards.

---

### Notes & Integration Tips
- The front-end uses `wagmi` hooks for reads/writes and `viem` helpers for ether formatting and parsing.
- The ABI provided in `lib/contract.ts` is the authoritative interface used by the hook.
- The hook exports transaction state (pending/confirming/confirmed), a `hash`, and surfaced `error` objects — use these for UX feedback.
- Reading dynamic arrays or decoding on-chain dynamic strings at scale may require additional RPC calls or a backend indexer for robust UI listing. The current hook uses a safe, best-effort approach for on-page listing; consider adding TheGraph or a server-side indexer for production-grade listing and decoding.
- Ensure your wallet is connected to the same network (Coston2/Flare testnet) as the contract when interacting.

---
