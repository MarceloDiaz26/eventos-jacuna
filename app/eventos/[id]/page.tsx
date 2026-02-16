'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
}

export default function EventoDashboardPage() {
  const params = useParams();
  const id = params.id as string;
  const [evento, setEvento] = useState<Evento | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`/api/eventos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setEvento(null);
        else setEvento(data);
      })
      .catch(() => setEvento(null))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <main style={styles.main}>
        <p style={styles.muted}>Cargando...</p>
      </main>
    );
  }

  if (!evento) {
    return (
      <main style={styles.main}>
        <p style={styles.error}>Evento no encontrado</p>
        <Link href="/" style={styles.backLink}>← Volver al inicio</Link>
      </main>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${baseUrl}/api/eventos/${id}/qr`;

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.backLink}>← Volver</Link>

      <header style={styles.header}>
        <h1 style={styles.title}>{evento.nombre}</h1>
        {evento.descripcion && (
          <p style={styles.desc}>{evento.descripcion}</p>
        )}
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Código QR para invitados</h2>
        <p style={styles.hint}>Los invitados escanean este QR para subir fotos</p>
        <div style={styles.qrWrapper}>
          <img
            src={qrUrl}
            alt="QR para subir fotos"
            width={240}
            height={240}
            style={styles.qrImg}
          />
        </div>
        <p style={styles.linkSmall}>
          O compartí este enlace: <code style={styles.code}>{baseUrl}/eventos/{id}/subir</code>
        </p>
      </section>

      <section style={styles.actions}>
        <Link href={`/eventos/${id}/subir`} style={styles.actionCard}>
          <span style={styles.actionIcon}>📤</span>
          <span style={styles.actionText}>Subir fotos</span>
          <span style={styles.actionDesc}>Como invitado</span>
        </Link>
        <Link href={`/eventos/${id}/album`} style={styles.actionCard}>
          <span style={styles.actionIcon}>📷</span>
          <span style={styles.actionText}>Álbum digital</span>
          <span style={styles.actionDesc}>Ver todas las fotos</span>
        </Link>
        <Link href={`/eventos/${id}/animacion`} style={styles.actionCard}>
          <span style={styles.actionIcon}>🎬</span>
          <span style={styles.actionText}>Animación en pantalla</span>
          <span style={styles.actionDesc}>Pase de fotos con animación</span>
        </Link>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  backLink: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    display: 'inline-block',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  desc: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  section: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid var(--border)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.25rem',
    fontWeight: 600,
  },
  hint: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
  },
  qrWrapper: {
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    display: 'inline-block',
    marginBottom: '1rem',
  },
  qrImg: {
    display: 'block',
  },
  linkSmall: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    wordBreak: 'break-all',
  },
  code: {
    background: 'var(--bg-input)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem 1rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    textAlign: 'center',
  },
  actionIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  actionText: {
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  actionDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  muted: { color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' },
  error: { color: 'var(--error)', textAlign: 'center', padding: '2rem' },
};
