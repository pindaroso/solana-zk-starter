'use client'

import React, { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-unsafe-burner'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'

import { SendButton } from '@/components/send-button'

export default function Home() {
  /// Testnet:
  // const endpoint = useMemo(() => "http://zk-testnet.helius.dev:8899", []);
  const endpoint = useMemo(() => 'http://127.0.0.1:8899', [])
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <div>Solana ZK Starter</div>
          <SendButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
