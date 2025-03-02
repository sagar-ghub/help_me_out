// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { Providers } from './components/Providers'
import { SocketProvider } from './components/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Innovative App',
  description: 'A map-based task sharing app',
  // you can set the lang here instead of as an attribute
  language: 'en',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <Providers>
          <Header />
          <SocketProvider>{children}</SocketProvider>
        </Providers>
      </body>
    </html>
  )
}
