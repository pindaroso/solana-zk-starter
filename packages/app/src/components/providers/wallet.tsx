'use client'

import React, {
  FC,
  ReactNode,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import {
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

const defaultEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8899'
    : 'https://api.devnet.solana.com'

const WalletContext = createContext({
  endpoint: defaultEndpoint,
  setEndpoint: (endpoint: string) => {},
})

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [endpoint, setEndpoint] = useState(defaultEndpoint)

  const value = {
    endpoint,
    setEndpoint,
  }

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [endpoint]
  )

  return (
    <WalletContext.Provider value={value}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => useContext(WalletContext)
