import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      </Head>
      <body className='overflow-hidden'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
