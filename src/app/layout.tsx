import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import 'simplebar-react/dist/simplebar.min.css'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/providers'
import { cn, generateMetadata } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = generateMetadata({
  title: "ChatMyPDF - Chat with advanced AI based on your PDF's",
  description: "ChatMyPDF is a free software that allows you to ask questions to an AI about the content of your PDF files.",
  image: "/thumbnail.png",
  icons: "/favicon.ico",
  noIndex: false
})

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
