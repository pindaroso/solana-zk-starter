'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection } from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

import { SendButton } from '@/components/send-button'
import { AirdropButton } from '@/components/airdrop-button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useWalletContext } from '@/components/providers/wallet'
import { formatAddress } from '@/lib/utils'

const defaultNetwork =
  process.env.NODE_ENV === 'development' ? 'localnet' : 'devnet'

export default function Home() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { setTheme, theme } = useTheme()

  const { endpoint, setEndpoint } = useWalletContext()

  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>(defaultNetwork)
  const [networkActive, setNetworkActive] = useState<boolean>(false)

  useEffect(() => {
    const conn = new Connection(endpoint, 'confirmed')

    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await conn.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL) // Convert lamports to SOL
        } catch (error) {
          console.error(error)
          toast.error('Network error')
        }
      }
    }

    fetchBalance()

    const subscriptionId = conn.onSlotChange(async (slotInfo) => {
      setNetworkActive(true)
      const block = await conn.getBlockTime(slotInfo.slot)
      setBlockNumber(block)
      await fetchBalance() // Update balance on slot change
    })

    return () => {
      conn.removeSlotChangeListener(subscriptionId)
    }
  }, [publicKey, endpoint]) // Run effect when publicKey or endpoint changes

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-lg">Solana ZK Starter</h1>
          <div className="flex items-center">
            {publicKey ? (
              <div className="flex flex-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-24">
                      {networkActive ? (
                        <span className="text-green-400 mr-2">&bull;</span>
                      ) : (
                        <span className="text-red-400 mr-2">&bull;</span>
                      )}
                      {network}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    defaultValue={network}
                    className="bg-background w-56"
                  >
                    <DropdownMenuLabel>Network</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={endpoint}
                      onValueChange={(value) => {
                        const endpoints = {
                          localnet: 'http://127.0.0.1:8899',
                          devnet: 'https://api.devnet.solana.com',
                          testnet: 'https://api.testnet.solana.com',
                          mainnet: 'https://api.mainnet-beta.solana.com',
                        }
                        setEndpoint(endpoints[value as keyof typeof endpoints])
                        setNetwork(value)
                      }}
                    >
                      <DropdownMenuRadioItem value="localnet">
                        Localnet
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="devnet">
                        Devnet
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="testnet">
                        Testnet
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem disabled value="mainnet">
                        Mainnet
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.preventDefault()
                          disconnect()
                          setBalance(null)
                        }}
                      >
                        <code>{formatAddress(publicKey.toBase58())}</code>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Disconnect Wallet</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <Button
                variant="outline"
                className="mr-2"
                onClick={(e) => {
                  e.preventDefault()
                  setVisible(true)
                }}
              >
                Connect Wallet
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <div className="flex flex-col max-w-md mx-auto p-4 gap-2">
          {publicKey ? (
            <Button variant="ghost">
              Wallet Balance:{' '}
              {balance !== null ? balance.toFixed(2) + ' SOL' : '-'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                setVisible(true)
              }}
            >
              Connect Wallet
            </Button>
          )}
          <div className="flex flex-col mt-2">
            <AirdropButton />
          </div>
          <div className="flex flex-col mt-2">
            <SendButton />
          </div>
        </div>
      </main>
      <footer className="p-4">
        <div className="container mx-auto text-center text-sm">
          {blockNumber !== null ? (
            <code className="text-green-400">{blockNumber}</code>
          ) : (
            <code>-</code>
          )}
        </div>
      </footer>
    </div>
  )
}
