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
  PackedCompressedAccountWithMerkleContext,
  PackedMerkleContext,
  CompressedAccount,
  CompressedAccountData,
  NewAddressParamsPacked,
  LightCompressedToken,
  LightRegistry,
  LightSystem,
} from '@lightprotocol/stateless.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { AddressInfo } from 'net'
import { Address } from '@coral-xyz/anchor'

export const CreateButton: FC = () => {
  const { publicKey } = useWallet()
  const { endpoint } = useWalletContext()
  const { program } = useProgramContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    try {
      const rpc = createRpc(endpoint)
      const proofWithContext = await rpc.getValidityProofAndRpcContext()
      const treeAccounts = defaultTestStateTreeAccounts()

      const inputs: Buffer[] = []
      const proof = proofWithContext.value.compressedProof
      const merkleContext = {
        merkleTreePubkeyIndex: 0,
        nullifierQueuePubkeyIndex: 0,
        leafIndex: 0,
        queueIndex: null,
      }
      const addressMerkleContext = {
        addressMerkleTreePubkeyIndex: 0,
        addressQueuePubkeyIndex: 0,
      }
      const merkleTreeRootIndex = 0
      const addressMerkleTreeRootIndex = proofWithContext.value.rootIndices[0]

      const tx = await program.methods
        .create(
          inputs,
          proof,
          merkleContext,
          merkleTreeRootIndex,
          addressMerkleContext,
          addressMerkleTreeRootIndex
        )
        .accounts({
          signer: publicKey,
          selfProgram: program.programId,
          cpiSigner: publicKey,
          lightSystemProgram: LightSystemProgram.programId,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      toast.success(`Tx Success: ${tx}`)
    } catch (error: any) {
      console.error(error)
      toast.error(`Creation Failed: ${error.message}`)
    }
  }, [publicKey, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Create Counter
    </Button>
  )
}

export default CreateButton
