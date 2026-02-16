'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Evento {
  id: string;
  nombre: string;
}

interface Foto {
  id: number;
  url: string;
}

export default function SubirPage() {
  const params = useParams();
  const id = params.id as string;
  const [evento, setEvento] = useState<Evento | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [mensaje, setMensaje] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/eventos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setEvento(null);
        else setEvento(data);
      })
      .catch(() => setEvento(null));
  }, [id]);

  const cargarFotos = () => {
    fetch(`/api/eventos/${id}/fotos`)
      .then((r) => r.json())
      .then(setFotos)
      .catch(console.error);
  };

  useEffect(() => {
    if (evento) cargarFotos();
  }, [evento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input?.files?.length || !evento) return;

    setSubiendo(true);
    setMensaje('');

    try {
      for (const file of Array.from(input.files)) {
        if (!file.type.startsWith('image/')) continue;
        const formData = new FormData();
        formData.append('foto', file);
        const res = await fetch(`/api/eventos/${id}/fotos`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al subir');
        }
      }
      setMensaje(`¡${input.files.length} foto(s) subida(s)! Ya están en el álbum.`);
      input.value = '';
      cargarFotos();
    } catch (err) {
      setMensaje((err as Error).message || 'Error al subir fotos');
    } finally {
      setSubiendo(false);
    }
  };

  const triggerInput = () => inputRef.current?.click();

  if (!evento) {
    return (
      <main style={styles.main}>
        <p style={styles.muted}>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>📸 {evento.nombre}</h1>
        <p style={styles.subtitle}>Subí tus fotos para que aparezcan en la pantalla</p>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.form?.requestSubmit()}
          style={styles.hiddenInput}
        />
        <button
          type="button"
          onClick={triggerInput}
          disabled={subiendo}
          style={styles.uploadBtn}
        >
          {subiendo ? '⏳ Subiendo...' : '📷 Elegir fotos'}
        </button>
      </form>

      {mensaje && (
        <p style={mensaje.startsWith('¡') ? styles.success : styles.error}>
          {mensaje}
        </p>
      )}

      {fotos.length > 0 && (
        <section style={styles.gallery}>
          <h3 style={styles.galleryTitle}>Fotos subidas</h3>
          <div style={styles.grid}>
            {fotos.slice(0, 12).map((f) => (
              <img
                key={f.id}
                src={f.url}
                alt=""
                style={styles.thumb}
              />
            ))}
          </div>
        </section>
      )}

      <Link href={`/eventos/${id}`} style={styles.backLink}>
        ← Volver al evento
      </Link>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 420,
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  form: {
    marginBottom: '1rem',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadBtn: {
    width: '100%',
    padding: '1.25rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  success: {
    color: 'var(--accent)',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  error: {
    color: 'var(--error)',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  gallery: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border)',
  },
  galleryTitle: {
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  thumb: {
    width: '100%',
    aspectRatio: 1,
    objectFit: 'cover',
    borderRadius: 8,
  },
  backLink: {
    display: 'block',
    marginTop: '2rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  muted: { color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' },
};
