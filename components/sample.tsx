// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useBountyContract } from "@/hooks/useContract"
import { isAddress } from "viem"

const SampleIntegration = () => {
  const { isConnected, address } = useAccount()
  const [description, setDescription] = useState("")
  const [rewardAmount, setRewardAmount] = useState("")
  const [applyId, setApplyId] = useState("")
  const [claimId, setClaimId] = useState("")
  const [completeId, setCompleteId] = useState("")

  const { data, actions, state } = useBountyContract()

  const handleCreate = async () => {
    if (!description || !rewardAmount) return
    try {
      await actions.createBounty(description, rewardAmount)
      setDescription("")
      setRewardAmount("")
    } catch (err) {
      console.error("Error creating bounty:", err)
    }
  }

  const handleApply = async () => {
    try {
      const id = Number(applyId)
      if (isNaN(id) || id < 0) return
      await actions.applyToBounty(id)
      setApplyId("")
    } catch (err) {
      console.error("Error applying:", err)
    }
  }

  const handleClaim = async () => {
    try {
      const id = Number(claimId)
      if (isNaN(id) || id < 0) return
      await actions.claimReward(id)
      setClaimId("")
    } catch (err) {
      console.error("Error claiming:", err)
    }
  }

  const handleMarkCompleted = async () => {
    try {
      const id = Number(completeId)
      if (isNaN(id) || id < 0) return
      await actions.markCompleted(id)
      setCompleteId("")
    } catch (err) {
      console.error("Error marking completed:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Bounty Board</h2>
          <p className="text-muted-foreground">Please connect your wallet to interact with the contract.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bounty Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Create bounties, apply as a hunter, and claim rewards.</p>
        </div>

        {/* Contract Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Bounties</p>
            <p className="text-2xl font-semibold text-foreground">{data.totalBounties}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Known On-Page Balance (best-effort)</p>
            <p className="text-2xl font-semibold text-foreground">{data.contractBalance} (raw units)</p>
          </div>
        </div>

        {/* Create Bounty */}
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bounty Description</label>
            <input
              type="text"
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Reward (FLR)</label>
            <input
              type="number"
              placeholder="0.00"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={state.isLoading || !description || !rewardAmount}
            className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {state.isLoading ? "Creating..." : "Create Bounty"}
          </button>
        </div>

        {/* Actions: Apply / Claim / Mark Completed */}
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Apply as Hunter (Bounty ID)</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="0"
                value={applyId}
                onChange={(e) => setApplyId(e.target.value)}
                min="0"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                onClick={handleApply}
                disabled={state.isLoading || applyId === ""}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Processing..." : "Apply"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Claim Reward (Bounty ID)</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="0"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                min="0"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                onClick={handleClaim}
                disabled={state.isLoading || claimId === ""}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Processing..." : "Claim"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mark Completed (Creator only) - Bounty ID</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="0"
                value={completeId}
                onChange={(e) => setCompleteId(e.target.value)}
                min="0"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                onClick={handleMarkCompleted}
                disabled={state.isLoading || completeId === ""}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {state.isLoading ? "Processing..." : "Mark Completed"}
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntegration
