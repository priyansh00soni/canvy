import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: 'Canvy - A quieter way to design',
  description: 'A simple canvas for shapes, ideas and text. No account required to start.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
