'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
}

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [creando, setCreando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/eventos')
      .then((r) => r.json())
      .then((data) => {
        setEventos(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setCargando(false));
  }, []);

  const crearEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreando(true);
    try {
      const res = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), descripcion }),
      });
      const data = await res.json();
      if (res.ok) {
        setEventos((prev) => [data, ...prev]);
        setNombre('');
        setDescripcion('');
      } else {
        alert(data.error || 'Error al crear evento');
        console.error('API error:', data);
      }
    } catch (err) {
      alert('Error al crear evento');
    } finally {
      setCreando(false);
    }
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href="/admin" style={styles.adminLink}>Admin</Link>
        <h1 style={styles.title}>📸 Fotos en Vivo</h1>
        <p style={styles.subtitle}>Proyectá fotos y videos en tus eventos al instante</p>
      </header>

      <section style={styles.createSection}>
        <h2 style={styles.sectionTitle}>Crear nuevo evento</h2>
        <form onSubmit={crearEvento} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre del evento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ ...styles.input, ...styles.textarea }}
            rows={2}
          />
          <button type="submit" disabled={creando} style={styles.btnPrimary}>
            {creando ? 'Creando...' : 'Crear evento'}
          </button>
        </form>
      </section>

      <section style={styles.eventsSection}>
        <h2 style={styles.sectionTitle}>Mis eventos</h2>
        {cargando ? (
          <p style={styles.muted}>Cargando...</p>
        ) : eventos.length === 0 ? (
          <p style={styles.muted}>Aún no tenés eventos. Creá uno arriba.</p>
        ) : (
          <div style={styles.eventList}>
            {eventos.map((e) => (
              <Link
                key={e.id}
                href={`/eventos/${e.id}`}
                style={styles.eventCard}
              >
                <span style={styles.eventName}>{e.nombre}</span>
                <span style={styles.eventMeta}>
                  Ver QR • Subir fotos • Álbum digital
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 560,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  header: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  adminLink: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  createSection: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid var(--border)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    color: 'var(--text)',
    fontSize: '1rem',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 60,
  },
  btnPrimary: {
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    padding: '0.85rem 1.5rem',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1rem',
  },
  btnPrimaryHover: {
    background: 'var(--accent-dim)',
  },
  eventsSection: {
    marginTop: '2rem',
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  eventCard: {
    display: 'block',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  eventName: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  eventMeta: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  muted: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '2rem',
  },
};
