import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import Navbar from '@/components/custom/navbar'
import NavigationHelper from '@/components/custom/navigation-helper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Das Coaching',
  description: 'Das Coaching - Admin Dashboard'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <section className='min-h-screen'>
            <main className='h-[10%]'>
              <Navbar className='h-full p-4' />
            </main>
            <main className='h-[90%]'>{children}</main>
          </section>
          <NavigationHelper />
        </ThemeProvider>
      </body>
    </html>
  )
}
