import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import {
  createRpc,
  LightSystemProgram,
  bn,
  defaultTestStateTreeAccounts,
  noopProgram,
  accountCompressionProgram,
  deriveAddress,
} from '@lightprotocol/stateless.js'
import { keccak_256 } from '@noble/hashes/sha3'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'

export function hashvToBn254FieldSizeBe(bytes: Uint8Array[]): Uint8Array {
  const hasher = keccak_256.create()
  for (const input of bytes) {
    hasher.update(input)
  }
  const hash = hasher.digest()
  hash[0] = 0
  return hash
}

export function deriveAddressSeed(
  seeds: Uint8Array[],
  programId: PublicKey
): Uint8Array {
  const combinedSeeds: Uint8Array[] = [programId.toBytes(), ...seeds]
  const hash = hashvToBn254FieldSizeBe(combinedSeeds)
  return hash
}

export class ProgramNotInitializedError extends Error {
  name = 'ProgramNotInitializedError'
}

export const CreateButton: FC = () => {
  const { endpoint } = useWalletContext()
  const { program } = useProgramContext()
  const wallet = useAnchorWallet()

  const onClick = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError()
    if (!program) throw new ProgramNotInitializedError()

    try {
      // TODO: Adapt for devnet, testnet and mainnet
      const rpc = createRpc()

      const { addressTree, addressQueue } = defaultTestStateTreeAccounts()

      const seed = deriveAddressSeed(
        [Buffer.from('counter'), wallet.publicKey.toBuffer()],
        program.programId
      )
      const address = await deriveAddress(seed, addressTree)

      const selectedAccounts: any[] = [
        {
          hash: bn(address.toBytes()),
          tree: addressTree,
          queue: addressQueue,
        },
      ]

      // TODO: Add hashes and new addresses
      const { compressedProof, rootIndices } = await rpc.getValidityProof(
        selectedAccounts.map((account: any) => bn(account.hash))
      )

      // TODO: Add input?
      const inputs: Buffer[] = []

      // TODO: Use LUT to get indices?
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
      const addressMerkleTreeRootIndex = rootIndices[0]

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
          compressedProof,
          merkleContext,
          merkleTreeRootIndex,
          addressMerkleContext,
          addressMerkleTreeRootIndex
        )
        .accounts({
          signer: wallet.publicKey,
          lightSystemProgram: LightSystemProgram.programId,
          accountCompressionProgram,
          accountCompressionAuthority,
          registeredProgramPda,
          noopProgram,
          selfProgram: program.programId,
          cpiSigner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      toast.success(`Tx Success: ${tx}`)
    } catch (error: any) {
      console.error(error)
      toast.error(`Creation Failed: ${error.message}`)
    }
  }, [wallet, endpoint, program])

  return (
    <Button onClick={onClick} disabled={!wallet}>
      Create Counter
    </Button>
  )
}

export default CreateButton
