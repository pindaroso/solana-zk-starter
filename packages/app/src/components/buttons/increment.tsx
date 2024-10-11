import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import {
  confirmTx,
  createRpc,
  LightSystemProgram,
  Rpc,
  bn,
  buildTx,
  defaultTestStateTreeAccounts,
  selectMinCompressedSolAccountsForTransfer,
} from '@lightprotocol/stateless.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'
import { SystemProgram } from '@solana/web3.js'

export const Increment: FC = () => {
  const { publicKey } = useWallet()
  const { endpoint } = useWalletContext()
  const { program } = useProgramContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    try {
      //const merkleContext = defaultTestStateTreeAccounts().addressTree
      //const tx = await program.methods
      //  .increment({
      //    inputs: [],
      //    proof: undefined,
      //    merkleTreeRootIndex: 0,
      //    addressMerkleTreeRootIndex: 0,
      //    outputStateTree: defaultTestStateTreeAccounts().merkleTree,
      //  })
      //  .accounts({
      //    signer: publicKey,
      //    selfProgram: program.programId,
      //    cpiSigner: publicKey,
      //    lightSystemProgram: LightSystemProgram.programId,
      //    systemProgram: SystemProgram.programId,
      //  })
      //  .rpc()
    } catch (error: any) {
      console.error(error)
      toast.error(`Increment Failed: ${error.message}`)
    }
  }, [publicKey, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Increment
    </Button>
  )
}
