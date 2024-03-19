import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import Navbar from '@/components/custom/navbar'
import NavigationHelper from '@/components/custom/navigation-helper'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sky Coaching',
  description: 'Sky Coaching Center - Admin Dashboard'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = auth()
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            {userId ? (
              <>
                <section className='min-h-screen'>
                  <main className='h-[10%]'>
                    <Navbar className='h-full p-4' />
                  </main>
                  <main className='h-[90%]'>{children}</main>
                </section>
                <NavigationHelper />
              </>
            ) : (
              children
            )}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
