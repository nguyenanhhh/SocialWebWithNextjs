import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import AppProviders from '@/providers/AppProviders'
import './globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppProviders>
        <Component {...pageProps} />
      </AppProviders>
    </SessionProvider>
  )
}
