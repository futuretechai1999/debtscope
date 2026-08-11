import './globals.css'

export const metadata = {
  title: 'DebtScope | Global Debt Intelligence',
  description: 'Understand, compare, and explore global external debt with clear data and AI-powered insights.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
