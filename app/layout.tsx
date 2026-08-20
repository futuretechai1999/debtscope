<meta name="google-site-verification" content="zkLSy1lhGjGIe0IHgp-fbpQTgIM3-Qi24MbN8AB-rRM" />
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import { LanguageProvider } from '../components/LanguageProvider'

export const metadata: Metadata = {
  title: 'DebtTeller | Geographic Intelligence & Global Debt Map',
  description: 'Explore external debt across countries with DebtTeller. Interactive global debt map and economic data visualization.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
<Analytics />