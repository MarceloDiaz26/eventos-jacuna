'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Foto {
  id: number;
  url: string;
  subido_at: string;
}

interface Evento {
  id: string;
  nombre: string;
}

export default function AlbumPage() {
  const params = useParams();
  const id = params.id as string;
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [expandida, setExpandida] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/eventos/${id}`)
      .then((r) => r.json())
      .then((data) => (data.error ? null : setEvento(data)))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const cargar = () => {
      fetch(`/api/eventos/${id}/fotos`)
        .then((r) => r.json())
        .then((data) => setFotos(Array.isArray(data) ? data : []))
        .catch(console.error);
    };
    cargar();
    const t = setInterval(cargar, 3000);
    return () => clearInterval(t);
  }, [id]);

  const formatearFecha = (f: string) => {
    const d = new Date(f);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href={`/eventos/${id}`} style={styles.backLink}>← Volver</Link>
        <h1 style={styles.title}>📷 {evento?.nombre || 'Álbum'}</h1>
        <p style={styles.subtitle}>
          {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'} en el álbum
        </p>
        {fotos.length > 0 && (
          <Link href={`/eventos/${id}/animacion`} style={styles.btnAnimacion}>
            🎬 Animación en pantalla
          </Link>
        )}
      </header>

      {fotos.length === 0 ? (
        <div style={styles.vacio}>
          <p style={styles.vacioText}>Aún no hay fotos</p>
          <p style={styles.vacioHint}>
            Los invitados pueden subir fotos escaneando el QR
          </p>
          <Link href={`/eventos/${id}/subir`} style={styles.btnSubir}>
            Subir primera foto
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {fotos.map((f) => (
            <div
              key={f.id}
              style={styles.card}
              onClick={() => setExpandida(expandida === f.url ? null : f.url)}
            >
              <img
                src={f.url}
                alt=""
                style={styles.img}
              />
              <span style={styles.fecha}>{formatearFecha(f.subido_at)}</span>
            </div>
          ))}
        </div>
      )}

      {expandida && (
        <div
          style={styles.modal}
          onClick={() => setExpandida(null)}
        >
          <img
            src={expandida}
            alt=""
            style={styles.modalImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '2rem',
  },
  backLink: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    display: 'inline-block',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  btnAnimacion: {
    display: 'inline-block',
    marginTop: '0.75rem',
    padding: '0.5rem 1rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  vacio: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  vacioText: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  vacioHint: {
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  btnSubir: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    borderRadius: 8,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
  },
  card: {
    position: 'relative',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    aspectRatio: 1,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  fecha: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0.5rem',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.9)',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    cursor: 'pointer',
  },
  modalImg: {
    maxWidth: '95%',
    maxHeight: '95%',
    objectFit: 'contain',
  },
};
