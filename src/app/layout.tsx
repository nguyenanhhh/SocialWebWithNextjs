import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Social Web App',
  description: 'Social media application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
