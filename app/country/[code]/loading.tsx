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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
          Loading country metrics...
        </div>

        <div
          style={{
            backgroundColor: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '28px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 600 }}>
            Fetching verified World Bank dataset...
          </div>
        </div>
      </div>
    </main>
  )
}