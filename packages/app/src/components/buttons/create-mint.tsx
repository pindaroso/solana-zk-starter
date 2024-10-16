import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import { createRpc } from '@lightprotocol/stateless.js'
import { createMint } from '@lightprotocol/compressed-token'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { Button } from '@/components/ui/button'
import { Signer } from '@solana/web3.js'

export const CreateMintButton: FC<{ className?: string }> = ({ className }) => {
  const { endpoint } = useWalletContext()
  const wallet = useAnchorWallet()

  const onClick = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError()

    toast.error('Not Implemented')
    return

    // @ts-ignore
    try {
      const rpc = createRpc(endpoint)
      const { transactionSignature } = await createMint(
        rpc,
        wallet as unknown as Signer, // TODO: Fix this
        // @ts-ignore
        wallet.publicKey,
        9
      )

      toast.success(`Tx Success: ${transactionSignature}`)
    } catch (error: any) {
      console.error(error)
      toast.error(`Mint Creation Failed: ${error.message}`)
    }
  }, [wallet, endpoint])

  return (
    <Button onClick={onClick} disabled={!wallet} className={className}>
      Create Mint
    </Button>
  )
}

export default CreateMintButton
