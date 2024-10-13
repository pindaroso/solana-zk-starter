import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import { createRpc } from '@lightprotocol/stateless.js'
import { createMint } from '@lightprotocol/compressed-token'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'
import { Signer } from '@solana/web3.js'

export const CreateMintButton: FC = () => {
  const { publicKey } = useWallet()
  const { endpoint } = useWalletContext()
  const { program } = useProgramContext()
  const wallet = useAnchorWallet()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()
    if (!wallet) throw new WalletNotConnectedError()

    try {
      // TODO: Adapt for devnet, testnet and mainnet
      const rpc = createRpc()
      const { mint, transactionSignature } = await createMint(
        rpc,
        wallet,
        wallet.publicKey,
        9
      )

      toast.success(`Tx Success: ${transactionSignature}`)
    } catch (error) {
      console.error(error)
    }
  }, [publicKey, wallet])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Create Mint
    </Button>
  )
}

export default CreateMintButton
