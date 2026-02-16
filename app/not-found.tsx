import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Página no encontrada</p>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '4rem 2rem',
    textAlign: 'center',
    minHeight: '50vh',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  text: {
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  link: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
};
