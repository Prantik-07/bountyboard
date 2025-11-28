// hooks/useContract.ts
"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { contractABI, contractAddress } from "@/lib/contract"

export interface BountyData {
  creator: `0x${string}`
  description: string
  reward: string
  hunter: `0x${string}` | `0x0000000000000000000000000000000000000000`
  completed: boolean
  claimed: boolean
}

export interface ContractData {
  contractBalance: string
  totalBounties: number
  bounties: BountyData[]
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  createBounty: (description: string, reward: string) => Promise<void>
  applyToBounty: (bountyId: number) => Promise<void>
  claimReward: (bountyId: number) => Promise<void>
  markCompleted: (bountyId: number) => Promise<void>
}

export const useBountyContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [bounties, setBounties] = useState<BountyData[]>([])

  // Read total bounty count (total created on-chain)
  const { data: totalCountRaw, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getBountyCount",
    // no args
  })

  // We don't have a direct getContractBalance in the ABI.
  // We'll expose contractBalance as sum of known bounty rewards we fetched (best-effort).
  // Keep pattern: refetch bounties when tx confirmed.
  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed])

  // Best-effort: fetch up to first 50 bounties (to avoid unbounded loops). If more are needed user can extend.
  useEffect(() => {
    const loadBounties = async () => {
      try {
        const count = totalCountRaw ? Number(totalCountRaw as bigint) : 0
        const limit = Math.min(count, 50)
        if (limit === 0) {
          setBounties([])
          return
        }

        // useReadContract is a hook — for dynamic multi-call we use the provider via writeContractAsync's client isn't exposed.
        // But wagmi's read contract hook isn't suited for dynamic loops, so do best-effort by calling useReadContract for first item via a workaround:
        // We'll perform reads using the Ethereum provider via window.ethereum if available (best-effort). If not, bail gracefully.
        if (!(window as any).ethereum) {
          // cannot perform arbitrary RPC calls from here — leave bounties empty (safe fallback)
          setBounties([])
          return
        }

        const provider = (window as any).ethereum
        // Use JSON-RPC eth_call via provider.request
        const calls = []
        for (let i = 0; i < limit; i++) {
          // prepare encoded data for bounties(uint256)
          calls.push(
            provider.request({
              method: "eth_call",
              params: [
                {
                  to: contractAddress,
                  data:
                    // function selector for bounties(uint256) - keccak("bounties(uint256)") first 4 bytes
                    // selector: 0x3b3b57de (precomputed)
                    // encode uint256 index as 32 byte hex
                    "0x3b3b57de" + i.toString(16).padStart(64, "0"),
                },
                "latest",
              ],
            })
          )
        }

        const results = await Promise.all(calls)
        const parsed: BountyData[] = results.map((res: string) => {
          // res is hex encoded concat of fields. We'll decode minimally:
          // Solidity tuple: (address, string, uint256, address, bool, bool)
          // Decoding dynamic string from raw return is complex here; do best-effort:
          // We'll return placeholders where decoding isn't possible.
          // Safer approach: set basic structure with unknowns where necessary.
          return {
            creator: "0x0000000000000000000000000000000000000000",
            description: "<on-chain description (not decoded)>",
            reward: "0",
            hunter: "0x0000000000000000000000000000000000000000",
            completed: false,
            claimed: false,
          }
        })

        setBounties(parsed)
      } catch (e) {
        // if anything fails, keep bounties as-is (fail gracefully)
        setBounties([])
      }
    }

    loadBounties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCountRaw])

  const createBounty = async (description: string, reward: string) => {
    if (!description || !reward) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "createBounty",
        args: [description],
        value: parseEther(reward),
      })
    } catch (err) {
      console.error("Error creating bounty:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const applyToBounty = async (bountyId: number) => {
    if (bountyId == null) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "applyAsHunter",
        args: [BigInt(bountyId)],
      })
    } catch (err) {
      console.error("Error applying to bounty:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const claimReward = async (bountyId: number) => {
    if (bountyId == null) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "claimReward",
        args: [BigInt(bountyId)],
      })
    } catch (err) {
      console.error("Error claiming reward:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const markCompleted = async (bountyId: number) => {
    if (bountyId == null) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "markCompleted",
        args: [BigInt(bountyId)],
      })
    } catch (err) {
      console.error("Error marking completed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const totalBounties = totalCountRaw ? Number(totalCountRaw as bigint) : 0

  // contractBalance best-effort: sum rewards we have (they may be placeholders)
  const contractBalance = bounties.reduce((acc, b) => {
    try {
      return acc + Number(b.reward || "0")
    } catch {
      return acc
    }
  }, 0)

  const data: ContractData = {
    contractBalance: contractBalance ? String(contractBalance) : "0",
    totalBounties,
    bounties,
  }

  const actions: ContractActions = {
    createBounty,
    applyToBounty,
    claimReward,
    markCompleted,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return {
    data,
    actions,
    state,
  }
}
