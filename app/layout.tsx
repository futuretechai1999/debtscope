import './globals.css'
import Navbar from '../components/Navbar'
import { LanguageProvider } from '../components/LanguageProvider'

export const metadata = {
  title: 'DebtScope | Global Debt Intelligence',
  description: 'Understand, compare, and explore global external debt with clear data and AI-powered insights.',
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