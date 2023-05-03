import '@/styles/globals.css'
import { cn } from '@/utils/cn'
import { Roboto_Mono as FontMono, Inter as FontSans } from 'next/font/google'

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata = {
  title: 'Countdown'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}>
        {children}
      </body>
    </html>
  )
}
