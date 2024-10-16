import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useCallback } from 'react'
import {
  LightSystemProgram,
  bn,
  buildTx,
  createRpc,
  defaultTestStateTreeAccounts,
  selectMinCompressedSolAccountsForTransfer,
} from '@lightprotocol/stateless.js'
import {
  ComputeBudgetProgram,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import toast from 'react-hot-toast'

import { useWalletContext } from '@/components/providers/wallet'
import { Button } from '@/components/ui/button'

export const SendButton: FC<{ className?: string }> = ({ className }) => {
  const { publicKey, sendTransaction } = useWallet()

  const { endpoint } = useWalletContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const connection = createRpc(endpoint)

    toast.error('Not Implemented')
    return

    const compressInstruction = await LightSystemProgram.compress({
      // @ts-ignore
      payer: publicKey,
      // @ts-ignore
      toAddress: publicKey,
      lamports: 1e8,
      outputStateTree: defaultTestStateTreeAccounts().merkleTree,
    })

    const compressInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }),
      compressInstruction,
    ]

    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await connection.getLatestBlockhashAndContext()

    // @ts-ignore
    const tx = buildTx(compressInstructions, publicKey, blockhashCtx.blockhash)
    const signature = await sendTransaction(tx, connection, {
      minContextSlot,
    })

    await connection.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    })

    toast.success(
      `Tx Success: https://explorer.solana.com/tx/${signature}?cluster=custom`
    )

    // Send compressed SOL to a random address
    const recipient = Keypair.generate().publicKey

    // @ts-ignore
    const accounts = await connection.getCompressedAccountsByOwner(publicKey)
    const [selectedAccounts, _] = selectMinCompressedSolAccountsForTransfer(
      accounts.items,
      1e7
    )

    // Retrieve validity proof for our selected balance
    const { compressedProof, rootIndices } = await connection.getValidityProof(
      selectedAccounts.map((account) => bn(account.hash))
    )

    // Create and send compressed transfer
    const sendInstruction = await LightSystemProgram.transfer({
      // @ts-ignore
      payer: publicKey,
      toAddress: recipient,
      lamports: 1e7,
      inputCompressedAccounts: selectedAccounts,
      outputStateTrees: [defaultTestStateTreeAccounts().merkleTree],
      recentValidityProof: compressedProof,
      recentInputStateRootIndices: rootIndices,
    })
    const sendInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }),
      sendInstruction,
    ]

    const {
      context: { slot: minContextSlotSend },
      value: {
        blockhash: blockhashSend,
        lastValidBlockHeight: lastValidBlockHeightSend,
      },
    } = await connection.getLatestBlockhashAndContext()

    const messageV0Send = new TransactionMessage({
      // @ts-ignore
      payerKey: publicKey,
      recentBlockhash: blockhashSend,
      instructions: sendInstructions,
    }).compileToV0Message()

    const transactionSend = new VersionedTransaction(messageV0Send)

    const sendSig = await sendTransaction(transactionSend, connection, {
      minContextSlot: minContextSlotSend,
    })

    await connection.confirmTransaction({
      blockhash: blockhashSend,
      lastValidBlockHeight: lastValidBlockHeightSend,
      signature: sendSig,
    })

    toast.success(
      `Tx Success: https://explorer.solana.com/tx/${sendSig}?cluster=custom`
    )
  }, [publicKey, sendTransaction, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey} className={className}>
      Send Compressed SOL
    </Button>
  )
}

export default SendButton
