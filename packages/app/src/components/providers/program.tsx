'use client'

import React, { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { IDL, Protocol } from '@/types/protocol'
import { useWalletContext } from './wallet'
import { useAnchorWallet } from '@solana/wallet-adapter-react'

const ProgramContext = createContext({
  program: null as unknown as Program<Protocol>,
})

export const ProgramContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { endpoint } = useWalletContext()
  const wallet = useAnchorWallet()

  const program = useMemo(() => {
    return new Program<Protocol>(
      IDL,
      new PublicKey('269WdsAWfRPf1qB4LVM5Zs11CtwfnvcCF91v8NKd4rck'),
      new AnchorProvider(
        new Connection(endpoint),
        wallet as any,
        AnchorProvider.defaultOptions()
      )
    )
  }, [endpoint, wallet])

  const value = {
    program,
  }

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  )
}

export const useProgramContext = () => useContext(ProgramContext)
