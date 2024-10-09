import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import { confirmTx, createRpc } from '@lightprotocol/stateless.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'

import { Button } from '@/components/ui/button'

export const AirdropButton: FC = () => {
  const { publicKey, sendTransaction } = useWallet()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const connection = createRpc()
    await confirmTx(connection, await connection.requestAirdrop(publicKey, 1e9))
  }, [publicKey, sendTransaction])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Airdrop SOL
    </Button>
  )
}
