export default function HomePage() {
  return (
    <main
      style={{
        background: '#07111F',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        padding: '40px',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>
        DebtScope
      </h1>

      <p style={{ color: '#A9B4C2', fontSize: '20px' }}>
        Track the world's debt in real time
      </p>

      <div
        style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: '#0F1C2E',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          <h3>Global External Debt</h3>
          <p style={{ fontSize: '28px' }}>$98.4 Trillion</p>
        </div>

        <div
          style={{
            background: '#0F1C2E',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          <h3>Countries Tracked</h3>
          <p style={{ fontSize: '28px' }}>210</p>
        </div>

        <div
          style={{
            background: '#0F1C2E',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          <h3>India (Featured)</h3>
          <p style={{ fontSize: '28px' }}>$620.7 Billion</p>
        </div>
      </div>
    </main>
  )
}
