import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import '@solana/wallet-adapter-react-ui/styles.css'
import '@/app/globals.css'

import { WalletContextProvider } from '@/components/providers/wallet'

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
      <body className={inter.className}>
        <ThemeProvider themes={['light', 'dark']} defaultTheme="system">
          <WalletContextProvider>{children}</WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
