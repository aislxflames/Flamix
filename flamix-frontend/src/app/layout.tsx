import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { dark, neobrutalism } from '@clerk/themes'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Flamix Webinterface',
  description: 'Created by aislx flames',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={
      {
        theme: dark,
        variables: { colorPrimary: 'red' }
      }
    }>
      <html lang="en">
        <body className={`dark overflow-hidden ${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <div className='bg-background/50 backdrop-blur-sm'>
          {children}
          </div>

        </body>
      </html>
    </ClerkProvider>
  )
}