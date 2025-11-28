export const contractAddress = "0xB61aCB4e6bA06CE5ef0c0846FE7b806670E9a747";

// Export only the ABI array expected by viem/wagmi
export const contractABI = [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "bountyId",
						"type": "uint256"
					}
				],
				"name": "BountyCompleted",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "bountyId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "description",
						"type": "string"
					}
				],
				"name": "BountyCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "bountyId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "hunter",
						"type": "address"
					}
				],
				"name": "HunterApplied",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "bountyId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "hunter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "RewardClaimed",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_bountyId",
						"type": "uint256"
					}
				],
				"name": "applyAsHunter",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "bounties",
				"outputs": [
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "hunter",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "completed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "claimed",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_bountyId",
						"type": "uint256"
					}
				],
				"name": "claimReward",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					}
				],
				"name": "createBounty",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getBountyCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_bountyId",
						"type": "uint256"
					}
				],
				"name": "markCompleted",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		] as const;