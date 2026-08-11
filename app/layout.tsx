import './globals.css'

export const metadata = {
  title: 'DebtScope',
  description: 'Global debt intelligence platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
