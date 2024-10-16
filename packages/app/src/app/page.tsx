'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection } from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

import AirdropButton from '@/components/buttons/airdrop'
import SendButton from '@/components/buttons/send'
import CreateMintButton from '@/components/buttons/create-mint'
import CreateCounterButton from '@/components/buttons/create-counter'
import IncrementCounterButton from '@/components/buttons/increment-counter'
import DeleteCounterButton from '@/components/buttons/delete-counter'
import DecrementCounterButton from '@/components/buttons/decrement-counter'
import CalculateCostSavingsButton from '@/components/buttons/calculate-cost'

const defaultNetwork =
  process.env.NODE_ENV === 'development' ? 'Localnet' : 'Devnet'

export default function Home() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { setTheme, theme } = useTheme()
  const params = useParams()

  const { endpoint, setEndpoint } = useWalletContext()

  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState(defaultNetwork)
  const [networkActive, setNetworkActive] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [hash, setHash] = useState(
    typeof window !== 'undefined' ? window.location.hash : ''
  )

  useEffect(() => {
    if (publicKey && !walletConnected) {
      setWalletConnected(true)
      toast.success('Wallet Connected')
    }
  }, [publicKey])

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

  useEffect(() => {
    setHash(window.location.hash)
  }, [params])

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-3 px-4 border-b border-1 border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm gap-6 text-zinc-700 dark:text-zinc-300">
            <Link href="/" className="text-primary text-lg">
              Solana ZK Starter
            </Link>
            <Link
              className={hash === '#/calculator' ? 'text-primary' : ''}
              href="#/calculator"
            >
              Cost Savings Calculator
            </Link>
            <Link
              className={hash === '#/counter' ? 'text-primary' : ''}
              href="#/counter"
            >
              Counter Program
            </Link>
            <Link
              className={hash === '#/mint' ? 'text-primary' : ''}
              href="#/mint"
            >
              Mint
            </Link>
            <Link
              className={hash === '#/faucet' ? 'text-primary' : ''}
              href="#/faucet"
            >
              Faucet
            </Link>
          </div>
          <div className="flex items-center">
            {publicKey ? (
              <>
                <Button variant="ghost" className="mr-2 font-normal">
                  {balance !== null ? balance.toFixed(2) + ' SOL' : '-'}
                </Button>
                <div className="flex flex-row">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-24 font-normal">
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
                      className="w-56"
                    >
                      <DropdownMenuLabel>Network</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={endpoint}
                        onValueChange={(value) => {
                          const endpoints = {
                            Localnet: 'http://127.0.0.1:8899',
                            Devnet: 'https://api.devnet.solana.com',
                            Testnet: 'https://api.testnet.solana.com',
                            Mainnet: 'https://api.mainnet-beta.solana.com',
                          }
                          setEndpoint(
                            endpoints[value as keyof typeof endpoints]
                          )
                          setNetwork(value)
                        }}
                      >
                        <DropdownMenuRadioItem value="Localnet">
                          Localnet
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Devnet">
                          Devnet
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Testnet">
                          Testnet
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem disabled value="Mainnet">
                          Mainnet
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="mx-2"
                          onClick={(e) => {
                            e.preventDefault()
                            disconnect()
                            setWalletConnected(false)
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
              </>
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
          {hash === '#/calculator' && (
            <CalculateCostSavingsButton className="flex flex-col mt-2" />
          )}
          {hash === '#/faucet' && (
            <AirdropButton className="flex flex-col mt-2" />
          )}
          {hash === '#/mint' && (
            <>
              <CreateMintButton className="flex flex-col mt-2" />
              <SendButton className="flex flex-col mt-2" />
            </>
          )}
          {hash === '#/counter' && (
            <>
              <CreateCounterButton className="flex flex-col mt-2" />
              <IncrementCounterButton className="flex flex-col mt-2" />
              <DecrementCounterButton className="flex flex-col mt-2" />
              <DeleteCounterButton className="flex flex-col mt-2" />
            </>
          )}
          {hash === '' && (
            <div className="flex flex-col text-center gap-2 text-zinc-700 dark:text-zinc-300">
              <h1 className="text-4xl">zkgm</h1>
              <p>Say hello to your new zk compresison app.</p>
            </div>
          )}
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
