'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Foto {
  id: number;
  evento_id: string;
  url: string;
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [fotosPorEvento, setFotosPorEvento] = useState<Record<string, Foto[]>>({});

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => r.json())
      .then((data) => setAutenticado(data.admin))
      .catch(() => setAutenticado(false));
  }, []);

  const cargarDatos = () => {
    fetch('/api/eventos')
      .then((r) => r.json())
      .then((eventos) => {
        const lista = Array.isArray(eventos) ? eventos : [];
        setEventos(lista);
        lista.forEach((e: Evento) => {
          fetch(`/api/eventos/${e.id}/fotos`)
            .then((r) => r.json())
            .then((fotos) => {
              setFotosPorEvento((prev) => ({
                ...prev,
                [e.id]: Array.isArray(fotos) ? fotos : [],
              }));
            });
        });
      });
  };

  useEffect(() => {
    if (autenticado) cargarDatos();
  }, [autenticado]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAutenticado(true);
      cargarDatos();
    } else {
      setError(data.error || 'Error al iniciar sesión');
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAutenticado(false);
  };

  const eliminarEvento = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el evento "${nombre}" y todas sus fotos?`)) return;
    const res = await fetch(`/api/eventos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEventos((prev) => prev.filter((e) => e.id !== id));
      setFotosPorEvento((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      alert('Error al eliminar');
    }
  };

  const [descargando, setDescargando] = useState(false);

  const descargarEvento = (id: string) => {
    setDescargando(true);
    window.open(`/api/admin/eventos/${id}/descargar`, '_blank');
    setTimeout(() => setDescargando(false), 2000);
  };

  const descargarTodo = () => {
    setDescargando(true);
    window.open('/api/admin/descargar-todo', '_blank');
    setTimeout(() => setDescargando(false), 2000);
  };

  const eliminarFoto = async (eventoId: string, fotoId: number) => {
    if (!confirm('¿Eliminar esta foto?')) return;
    const res = await fetch(`/api/eventos/${eventoId}/fotos/${fotoId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setFotosPorEvento((prev) => ({
        ...prev,
        [eventoId]: (prev[eventoId] || []).filter((f) => f.id !== fotoId),
      }));
    } else {
      alert('Error al eliminar');
    }
  };

  if (autenticado === null) {
    return (
      <main style={styles.main}>
        <p style={styles.muted}>Cargando...</p>
      </main>
    );
  }

  if (!autenticado) {
    return (
      <main style={styles.main}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>Administrador</h1>
          <form onSubmit={login} style={styles.form}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoFocus
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.btn}>
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel de administración</h1>
        <div style={styles.headerActions}>
          <Link href="/" style={styles.link}>← Inicio</Link>
          <button onClick={logout} style={styles.btnLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Eventos</h2>
          {eventos.length > 0 && (
            <button
              onClick={descargarTodo}
              disabled={descargando}
              style={styles.btnDescargar}
            >
              {descargando ? 'Preparando...' : '📥 Descargar todas las fotos'}
            </button>
          )}
        </div>
        {eventos.length === 0 ? (
          <p style={styles.muted}>No hay eventos</p>
        ) : (
          <div style={styles.eventList}>
            {eventos.map((e) => (
              <div key={e.id} style={styles.eventCard}>
                <div style={styles.eventHeader}>
                  <div>
                    <strong>{e.nombre}</strong>
                    {e.descripcion && (
                      <span style={styles.desc}> – {e.descripcion}</span>
                    )}
                  </div>
                  <div style={styles.eventActions}>
                    <Link href={`/eventos/${e.id}`} style={styles.link}>
                      Ver
                    </Link>
                    {(fotosPorEvento[e.id] || []).length > 0 && (
                      <button
                        onClick={() => descargarEvento(e.id)}
                        disabled={descargando}
                        style={styles.btnDescargarEvento}
                      >
                        Descargar
                      </button>
                    )}
                    <button
                      onClick={() => eliminarEvento(e.id, e.nombre)}
                      style={styles.btnEliminar}
                    >
                      Eliminar evento
                    </button>
                  </div>
                </div>
                <div style={styles.fotosGrid}>
                  {(fotosPorEvento[e.id] || []).map((f) => (
                    <div key={f.id} style={styles.fotoCard}>
                      <img src={f.url} alt="" style={styles.fotoImg} />
                      <button
                        onClick={() => eliminarFoto(e.id, f.id)}
                        style={styles.btnEliminarFoto}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  loginBox: {
    maxWidth: 320,
    margin: '4rem auto',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: '1rem',
  },
  error: {
    color: 'var(--error)',
    fontSize: '0.9rem',
  },
  btn: {
    padding: '0.75rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: 'var(--accent)',
  },
  btnLogout: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
  },
  btnDescargar: {
    padding: '0.5rem 1rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnDescargarEvento: {
    padding: '0.4rem 0.75rem',
    background: 'var(--accent)',
    color: 'var(--bg-dark)',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  eventCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  desc: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  eventActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  btnEliminar: {
    padding: '0.4rem 0.75rem',
    background: 'var(--error)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  fotosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '0.75rem',
  },
  fotoCard: {
    position: 'relative',
  },
  fotoImg: {
    width: '100%',
    aspectRatio: 1,
    objectFit: 'cover',
    borderRadius: 8,
  },
  btnEliminarFoto: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    padding: '0.25rem',
    background: 'rgba(255,107,107,0.95)',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  muted: {
    color: 'var(--text-muted)',
  },
};
