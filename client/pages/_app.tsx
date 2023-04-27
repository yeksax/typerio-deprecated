import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './layout';
import Head from 'next/head';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    <Head>
      <title>Typer.io</title>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
