import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

import '@solana/wallet-adapter-react-ui/styles.css'
import '@/app/globals.css'

import { ProgramContextProvider } from '@/components/providers/program'
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletContextProvider>
          <ProgramContextProvider>
            <ThemeProvider
              enableSystem
              disableTransitionOnChange
              attribute="class"
              defaultTheme="system"
            >
              {children}
              <Toaster
                toastOptions={{
                  className: 'dark:bg-secondary bg-secondary dark:text-primary',
                  position: 'bottom-left',
                  duration: 10_000,
                  style: {
                    maxWidth: 2_000,
                  },
                }}
              />
            </ThemeProvider>
          </ProgramContextProvider>
        </WalletContextProvider>
      </body>
    </html>
  )
}
