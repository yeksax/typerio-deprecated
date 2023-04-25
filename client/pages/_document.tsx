import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <body className='overflow-hidden'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
