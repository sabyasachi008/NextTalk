import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/providers/Auth/AuthProvider';
import { ClientContextProvider } from '@/lib/providers/Client/ClientProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatApp — Real-Time Messaging',
  description: 'A real-time chat application built with Next.js and Socket.io',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientContextProvider>
            {children}
          </ClientContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
