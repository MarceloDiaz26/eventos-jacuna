'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Algo salió mal</h2>
      <p style={styles.text}>{error.message}</p>
      <button onClick={reset} style={styles.button}>
        Reintentar
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '3rem',
    textAlign: 'center',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    color: 'var(--error)',
  },
  text: {
    color: 'var(--text-muted)',
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    borderRadius: 8,
    fontWeight: 600,
  },
};
