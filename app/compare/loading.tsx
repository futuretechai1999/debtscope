export default function Loading() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#070b14',
        color: '#ffffff',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
          Loading comparison data...
        </div>

        <div
          style={{
            backgroundColor: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '24px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#38bdf8', fontSize: '16px', fontWeight: 600 }}>
            Aggregating multi-country economic metrics...
          </div>
        </div>
      </div>
    </main>
  )
}