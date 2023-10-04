import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import 'simplebar-react/dist/simplebar.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatMyPDF AI',
  description: 'Upload any PDF and chat based on the contents of the PDF file with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={cn("min-h-screen antialiased grainy", inter.className)}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}
