'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: '2rem', fontFamily: 'system-ui', background: '#0f0f14', color: '#e8e8ed' }}>
        <div style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center' }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#00d4aa',
              color: '#0f0f14',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
