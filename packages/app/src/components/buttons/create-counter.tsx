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
  CompressedAccountWithMerkleContext,
  createCompressedAccount,
} from '@lightprotocol/stateless.js'
import { keccak_256 } from '@noble/hashes/sha3'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { useProgramContext } from '@/components/providers/program'
import { Button } from '@/components/ui/button'
import { BN } from '@coral-xyz/anchor'

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

export const CreateCounterButton: FC<{ className?: string }> = ({
  className,
}) => {
  const { endpoint } = useWalletContext()
  const { program } = useProgramContext()
  const wallet = useAnchorWallet()

  const onClick = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError()
    if (!program) throw new ProgramNotInitializedError()

    toast.error('Not Implemented')

    //try {
    //  // TODO: Adapt for devnet, testnet and mainnet
    //  const rpc = createRpc()

    //  const { addressTree, addressQueue, nullifierQueue } =
    //    defaultTestStateTreeAccounts()

    //  const seed = deriveAddressSeed(
    //    [Buffer.from('counter'), wallet.publicKey.toBuffer()],
    //    program.programId
    //  )
    //  const address = await deriveAddress(seed, addressTree)
    //  const compressedAccount = createCompressedAccount(
    //    wallet.publicKey,
    //    bn(10),
    //    undefined,
    //    [10]
    //  )

    //  const selectedAccounts: CompressedAccountWithMerkleContext[] = [
    //    {
    //      ...compressedAccount,
    //      readOnly: true,
    //      merkleTree: addressTree,
    //      nullifierQueue,
    //      hash: [bn(address.toBytes()).toNumber()],
    //      leafIndex: 0,
    //    },
    //  ]

    //  /*
    //   * ERROR: Failed to get ValidityProof for compressed accounts 36439686636752871256271152024530679660001424812964160093210165672697738154: Record Not Found: Leaf nodes not found for hashes. Got 0 hashes. Expected 1.
    //   */
    //  const { compressedProof, rootIndices } = await rpc.getValidityProof(
    //    selectedAccounts.map(({ hash }) => bn(hash[0])),
    //    [bn(address.toBytes())]
    //  )

    //  // TODO: Add input?
    //  const inputs: Buffer[] = []

    //  // TODO: Use LUT to get indices?
    //  const merkleContext = {
    //    merkleTreePubkeyIndex: 0,
    //    nullifierQueuePubkeyIndex: 0,
    //    leafIndex: 0,
    //    queueIndex: null,
    //  }
    //  const addressMerkleContext = {
    //    addressMerkleTreePubkeyIndex: 0,
    //    addressQueuePubkeyIndex: 0,
    //  }
    //  const merkleTreeRootIndex = 0
    //  const addressMerkleTreeRootIndex = rootIndices[0]

    //  const [registeredProgramPda] = PublicKey.findProgramAddressSync(
    //    [LightSystemProgram.programId.toBuffer()],
    //    new PublicKey(accountCompressionProgram)
    //  )

    //  const [accountCompressionAuthority] = PublicKey.findProgramAddressSync(
    //    [Buffer.from('cpi_authority')],
    //    new PublicKey(LightSystemProgram.programId)
    //  )

    //  const tx = await program.methods
    //    .create(
    //      inputs,
    //      compressedProof,
    //      merkleContext,
    //      merkleTreeRootIndex,
    //      addressMerkleContext,
    //      addressMerkleTreeRootIndex
    //    )
    //    .accounts({
    //      signer: wallet.publicKey,
    //      lightSystemProgram: LightSystemProgram.programId,
    //      accountCompressionProgram,
    //      accountCompressionAuthority,
    //      registeredProgramPda,
    //      noopProgram,
    //      selfProgram: program.programId,
    //      cpiSigner: wallet.publicKey,
    //      systemProgram: SystemProgram.programId,
    //    })
    //    .rpc()

    //  toast.success(`Tx Success: ${tx}`)
    //} catch (error: any) {
    //  console.error(error)
    //  toast.error(`Creation Failed: ${error.message}`)
    //}
  }, [wallet, endpoint, program])

  return (
    <Button onClick={onClick} disabled={!wallet} className={className}>
      Create Counter
    </Button>
  )
}

export default CreateCounterButton
