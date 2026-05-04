import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/next'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
      })
    }
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#00ff88" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AVCommand" />
        <meta name="description" content="AI-powered RS-232 command generator and serial control assistant for AV integrators" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-152.png" />
        <title>AVCommand — AV Control Assistant</title>
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
