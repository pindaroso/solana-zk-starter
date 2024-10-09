import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solana ZK Starter',
  description: 'Solana ZK Starter',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
