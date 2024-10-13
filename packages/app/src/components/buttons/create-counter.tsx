import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import {
  confirmTx,
  createRpc,
  LightSystemProgram,
  Rpc,
  bn,
  buildTx,
  defaultTestStateTreeAccounts,
  packNewAddressParams,
  PackedMerkleContext,
  CompressedAccount,
  CompressedAccountData,
  NewAddressParamsPacked,
  LightCompressedToken,
  LightRegistry,
  LightSystem,
  packCompressedAccounts,
  deriveAddress,
  noopProgram,
  accountCompressionProgram,
  createCompressedAccount,
  compress,
} from '@lightprotocol/stateless.js'
import { createMint } from '@lightprotocol/compressed-token'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'

export const CreateButton: FC = () => {
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
      const { merkleTree, nullifierQueue, addressTree, addressQueue } =
        defaultTestStateTreeAccounts()
      //await compress(rpc, wallet, 1e9, publicKey, merkleTree)

      const counterAddress = deriveAddress(Buffer.from('counter'), publicKey)
      //const createAccountTx = createCompressedAccount(
      //  publicKey,
      //  bn(1_000),
      //  undefined,
      //  counterAddress
      //)
      const proofWithContext = await rpc.getValidityProofAndRpcContext()
      const treeAccounts = defaultTestStateTreeAccounts()

      const inputs: Buffer[] = []
      const proof = proofWithContext.value.compressedProof

      //treeAccounts.merkleTree
      //treeAccounts.nullifierQueue

      //const packed = packCompressedAccounts(
      //  [treeAccounts.merkleTree, treeAccounts.nullifierQueue],
      //  [],
      //  []
      //)

      // TODO: Create counter account

      const merkleContext = {
        merkleTreePubkeyIndex: 0, // TODO: Merkle tree pubkey index
        nullifierQueuePubkeyIndex: 0, // TODO: Nullifier queue pubkey index
        leafIndex: 0,
        queueIndex: null,
      }
      const addressMerkleContext = {
        addressMerkleTreePubkeyIndex: 0,
        addressQueuePubkeyIndex: 0,
      }
      const merkleTreeRootIndex = 0
      const addressMerkleTreeRootIndex = proofWithContext.value.rootIndices[0]

      const [registeredProgramPda] = PublicKey.findProgramAddressSync(
        [LightSystemProgram.programId.toBuffer()],
        new PublicKey(accountCompressionProgram)
      )

      const [accountCompressionAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from('cpi_authority')],
        new PublicKey(LightSystemProgram.programId)
      )

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
          lightSystemProgram: LightSystemProgram.programId,
          accountCompressionProgram,
          accountCompressionAuthority,
          registeredProgramPda,
          noopProgram,
          selfProgram: program.programId,
          cpiSigner: publicKey,
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
