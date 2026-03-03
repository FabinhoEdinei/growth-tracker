export default function DashboardAlgasPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Courier New, monospace',
      color: '#00ff88',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '448px', marginBottom: '20px' }}>🦠</h1>
        <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Dashboard Algas</h2>
        <p style={{ fontSize: '14px', color: 'rgba(0,255,136,0.6)' }}>
          EM CONSTRUÇÃO
        </p>
      </div>
    </div>
  );
}