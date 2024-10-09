'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

import { SendButton } from '@/components/send-button'
import { AirdropButton } from '@/components/airdrop-button'

import { Button } from '@/components/ui/button'

export default function Home() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-4">
        <div className="container mx-auto flex justify-between items-center">
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
          Block Number
        </div>
      </footer>
    </div>
  )
}
