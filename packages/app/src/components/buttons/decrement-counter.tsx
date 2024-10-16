import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { Button } from '@/components/ui/button'

export const DecrementCounterButton: FC<{ className?: string }> = ({
  className,
}) => {
  const { publicKey } = useWallet()
  const { endpoint } = useWalletContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    try {
      // TODO: Implement
      toast.error('Not Implemented')
    } catch (error: any) {
      console.error(error)
      toast.error(`Increment Failed: ${error.message}`)
    }
  }, [publicKey, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey} className={className}>
      Decrement Counter
    </Button>
  )
}

export default DecrementCounterButton
