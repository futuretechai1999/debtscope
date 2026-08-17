import DebtScopeLogo from './DebtScopeLogo'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #1e293b',
        backgroundColor: '#070b14',
      }}
    >
      <DebtScopeLogo />
      <nav style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 600 }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Overview
        </Link>
        <Link href="/map" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Global Map
        </Link>
        <Link href="/compare" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Compare
        </Link>
        <Link href="/rankings" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Rankings
        </Link>
      </nav>
    </header>
  )
}