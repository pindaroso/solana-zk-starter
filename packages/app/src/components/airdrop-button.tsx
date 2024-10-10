import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import { confirmTx, createRpc } from '@lightprotocol/stateless.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { Button } from '@/components/ui/button'

export const AirdropButton: FC = () => {
  const { publicKey } = useWallet()

  const { endpoint } = useWalletContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    try {
      const conn = createRpc(endpoint)
      await confirmTx(conn, await conn.requestAirdrop(publicKey, 1e9))
    } catch (error: any) {
      console.error(error)
      toast.error(`Airdrop Failed: ${error.message}`)
    }
  }, [publicKey, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Airdrop SOL
    </Button>
  )
}
