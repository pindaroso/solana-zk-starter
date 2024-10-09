'use client'

import React from 'react'

import { SendButton } from '@/components/send-button'
import { AirdropButton } from '@/components/airdrop-button'

export default function Home() {
  return (
    <div>
      <AirdropButton />
      <SendButton />
    </div>
  )
}
