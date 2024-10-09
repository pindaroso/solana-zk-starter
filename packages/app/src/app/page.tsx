'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection } from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import { SendButton } from '@/components/send-button'
import { AirdropButton } from '@/components/airdrop-button'

import { Button } from '@/components/ui/button'

export default function Home() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null) // Add state for balance

  useEffect(() => {
    const conn = new Connection('http://127.0.0.1:8899', 'confirmed')

    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await conn.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL) // Convert lamports to SOL
      }
    }

    fetchBalance() // Fetch balance on component mount

    const subscriptionId = conn.onSlotChange(async (slotInfo) => {
      const block = await conn.getBlockTime(slotInfo.slot)
      setBlockNumber(block)
      await fetchBalance() // Update balance on slot change
    })

    return () => {
      conn.removeSlotChangeListener(subscriptionId)
    }
  }, [publicKey]) // Re-run effect when publicKey changes

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-lg">Solana ZK Starter App</h1>
          <div className="flex items-center gap-2">
            {publicKey ? (
              <div className="flex flex-row gap-1">
                <Button variant="link">
                  {balance !== null ? balance.toFixed(2) : 'Loading...'} SOL
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    disconnect()
                  }}
                >
                  {publicKey.toBase58().slice(0, 4)}...
                  {publicKey.toBase58().slice(-4)}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setVisible(true)
                }}
              >
                Select Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow mx-auto p-4">
        <div className="flex flex-col gap-2">
          <AirdropButton />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <SendButton />
        </div>
      </main>

      <footer className="p-4">
        <div className="container mx-auto text-center text-green-500">
          {blockNumber !== null ? blockNumber : 'Loading...'}
        </div>
      </footer>
    </div>
  )
}
