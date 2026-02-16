'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Foto {
  id: number;
  url: string;
}

interface Evento {
  id: string;
  nombre: string;
}

const DURACION = 5;
const POLL_INTERVAL = 3000;
const FOTOS_PARA_COLLAGE = 6;
const SINGLES_ENTRE_COLLAGES = 3;

export default function AnimacionPage() {
  const params = useParams();
  const id = params.id as string;
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [transicion, setTransicion] = useState<'entrando' | 'visible' | 'saliendo'>('visible');
  const fotosRef = useRef<Foto[]>([]);
  fotosRef.current = fotos;

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
    const t = setInterval(cargar, POLL_INTERVAL);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => {
    if (fotos.length === 0) return;

    const timer = setInterval(() => {
      setTransicion('saliendo');
      setTimeout(() => {
        const total = fotosRef.current.length;
        if (total === 0) return;
        setSlideIndex((i) => i + 1);
        setTransicion('entrando');
        setTimeout(() => setTransicion('visible'), 100);
      }, 500);
    }, DURACION * 1000);

    return () => clearInterval(timer);
  }, [id, fotos.length]);

  const esCollage = fotos.length >= FOTOS_PARA_COLLAGE && 
    (slideIndex % (SINGLES_ENTRE_COLLAGES + 1)) === SINGLES_ENTRE_COLLAGES;

  const singleIndex = slideIndex - Math.floor(slideIndex / (SINGLES_ENTRE_COLLAGES + 1));
  const fotoActual = !esCollage && fotos.length > 0
    ? fotos[Math.abs(singleIndex) % fotos.length]
    : null;

  const fotosCollage = esCollage && fotos.length >= FOTOS_PARA_COLLAGE
    ? (() => {
        const grupo = Math.floor(slideIndex / (SINGLES_ENTRE_COLLAGES + 1));
        const inicio = (grupo * FOTOS_PARA_COLLAGE) % fotos.length;
        return Array.from({ length: FOTOS_PARA_COLLAGE }, (_, i) => 
          fotos[(inicio + i) % fotos.length]
        );
      })()
    : [];

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        {evento && (
          <span style={styles.eventName}>{evento.nombre}</span>
        )}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {fotos.length > 0 && (
            <span style={styles.counter}>
              {esCollage ? 'Collage' : `Foto ${(singleIndex % fotos.length) + 1}`} · {fotos.length} fotos
            </span>
          )}
          <Link href={`/eventos/${id}`} style={styles.closeBtn}>
            ✕ Salir
          </Link>
        </div>
      </div>

      {fotoActual ? (
        <div
          style={{
            ...styles.slide,
            opacity: transicion === 'visible' ? 1 : transicion === 'entrando' ? 0 : 1,
            transform: `scale(${transicion === 'visible' ? 1 : transicion === 'entrando' ? 1.05 : 1})`,
          }}
        >
          <img
            key={fotoActual.id}
            src={fotoActual.url}
            alt=""
            style={{
              ...styles.image,
              animation: transicion === 'entrando' ? 'animacion-kenburns 8s ease-out forwards' : undefined,
            }}
          />
        </div>
      ) : fotosCollage.length > 0 ? (
        <div
          style={{
            ...styles.slide,
            ...styles.collageWrap,
            opacity: transicion === 'visible' ? 1 : transicion === 'entrando' ? 0 : 1,
            transform: `scale(${transicion === 'visible' ? 1 : transicion === 'entrando' ? 0.95 : 1})`,
          }}
        >
          <div style={styles.collageGrid}>
            {fotosCollage.map((f, i) => (
              <div key={`${f.id}-${i}`} style={styles.collageCell}>
                <img src={f.url} alt="" style={styles.collageImg} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.empty}>
          <p style={styles.emptyText}>Esperando fotos...</p>
          <p style={styles.emptyHint}>
            Los invitados pueden escanear el QR para subir fotos
          </p>
        </div>
      )}

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    background: '#000 url(/bg-proyeccion.png) no-repeat center center',
    backgroundSize: 'cover',
    overflow: 'hidden',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  collageWrap: {
    padding: '2%',
  },
  collageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '1%',
    width: '100%',
    height: '100%',
    maxWidth: 1200,
    maxHeight: 800,
  },
  collageCell: {
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  collageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '1rem 1.5rem',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  eventName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  closeBtn: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.9rem',
    padding: '0.4rem 0.8rem',
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
  },
  counter: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyText: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  emptyHint: {
    fontSize: '1rem',
  },
};
