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
import { useWalletContext } from '@/components/providers/wallet'

import { Button } from '@/components/ui/button'

export const SendButton: FC = () => {
  const { publicKey, sendTransaction } = useWallet()

  const { endpoint } = useWalletContext()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const connection = createRpc(endpoint)

    /// compress to self
    const compressInstruction = await LightSystemProgram.compress({
      payer: publicKey,
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

    const tx = buildTx(compressInstructions, publicKey, blockhashCtx.blockhash)

    const signature = await sendTransaction(tx, connection, {
      minContextSlot,
    })

    await connection.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    })

    console.log(
      `Compressed ${1e8} lamports! txId: https://explorer.solana.com/tx/${signature}?cluster=custom`
    )

    /// Send compressed SOL to a random address
    const recipient = Keypair.generate().publicKey

    /// 1. We need to fetch our sol balance
    const accounts = await connection.getCompressedAccountsByOwner(publicKey)

    console.log('accounts', accounts.items)
    const [selectedAccounts, _] = selectMinCompressedSolAccountsForTransfer(
      accounts.items,
      1e7
    )

    console.log('selectedAccounts', selectedAccounts)

    /// 2. Retrieve validity proof for our selected balance
    const { compressedProof, rootIndices } = await connection.getValidityProof(
      selectedAccounts.map((account) => bn(account.hash))
    )

    /// 3. Create and send compressed transfer
    const sendInstruction = await LightSystemProgram.transfer({
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
      payerKey: publicKey,
      recentBlockhash: blockhashSend,
      instructions: sendInstructions,
    }).compileToV0Message()

    const transactionSend = new VersionedTransaction(messageV0Send)

    const signatureSend = await sendTransaction(transactionSend, connection, {
      minContextSlot: minContextSlotSend,
    })

    await connection.confirmTransaction({
      blockhash: blockhashSend,
      lastValidBlockHeight: lastValidBlockHeightSend,
      signature: signatureSend,
    })

    console.log(
      `Sent ${1e7} lamports to ${recipient.toBase58()} ! txId: https://explorer.solana.com/tx/${signatureSend}?cluster=custom`
    )
  }, [publicKey, sendTransaction, endpoint])

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Send Compressed SOL
    </Button>
  )
}
