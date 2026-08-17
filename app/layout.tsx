import './globals.css'
import Navbar from '../components/Navbar'
import { LanguageProvider } from '../components/LanguageProvider'

export const metadata = {
  title: 'DebtScope | Global External Debt Intelligence',
  description: 'Explore external debt data for developing economies. Compare countries, view interactive global maps, and get plain-language economic insights.',
  keywords: 'external debt, world bank data, country debt comparison, global economy, debt map, India external debt, China debt',
  openGraph: {
    title: 'DebtScope | Global Debt Tracker',
    description: 'Track and compare the external debt of 120+ countries in real-time.',
    url: 'https://debtscope-silk.vercel.app',
    siteName: 'DebtScope',
    locale: 'en_US',
    type: 'website',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#070b14', color: '#ffffff' }}>
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}