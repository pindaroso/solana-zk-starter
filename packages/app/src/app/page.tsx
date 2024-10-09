'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection } from '@solana/web3.js'

import { SendButton } from '@/components/send-button'
import { AirdropButton } from '@/components/airdrop-button'

import { Button } from '@/components/ui/button'

export default function Home() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [blockNumber, setBlockNumber] = useState<number | null>(null)

  useEffect(() => {
    const conn = new Connection('http://127.0.0.1:8899', 'confirmed')

    const subscriptionId = conn.onSlotChange((slotInfo) => {
      setBlockNumber(slotInfo.slot)
    })

    return () => {
      conn.removeSlotChangeListener(subscriptionId)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-lg">Solana ZK Starter App</h1>
          <div className="flex items-center gap-2">
            {publicKey ? (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  disconnect()
                }}
              >
                {publicKey.toBase58().slice(0, 4)}...
                {publicKey.toBase58().slice(-4)}
              </Button>
            ) : (
              <Button
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

      <main className="flex-grow container mx-auto p-4">
        <AirdropButton />
        <SendButton />
      </main>

      <footer className="p-4">
        <div className="container mx-auto text-center text-muted-foreground">
          Block Number: {blockNumber !== null ? blockNumber : 'Loading...'}
        </div>
      </footer>
    </div>
  )
}
