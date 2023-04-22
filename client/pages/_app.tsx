import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './layout';

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return <SessionProvider session={session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
