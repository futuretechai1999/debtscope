import Link from 'next/link'

export default function DebtTellerLogo() {
  return (
    <Link
      href="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))',
        }}
      >
        <defs>
          <linearGradient id="scopeWarmGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="35%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="innerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <circle 
          cx="17" 
          cy="17" 
          r="15" 
          stroke="url(#scopeWarmGradient)" 
          strokeWidth="2.8" 
          strokeOpacity="0.85" 
        />

        <circle 
          cx="17" 
          cy="17" 
          r="10.5" 
          stroke="url(#innerRingGradient)" 
          strokeWidth="2" 
        />

        <path
          d="M9.5 22.5L15 16.5L19 20L25 11.5"
          stroke="url(#scopeWarmGradient)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle 
          cx="25" 
          cy="11.5" 
          r="2.8" 
          fill="#ffffff" 
          stroke="#f59e0b"
          strokeWidth="1.4"
        />
      </svg>

      <span
        style={{
          fontSize: '21px',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
        }}
      >
        Debt
        <span
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #eab308 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Teller
        </span>
      </span>
    </Link>
  )
}