import { neon } from '@neondatabase/serverless';

let cached: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!cached) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL no configurada. Agregá Neon Postgres en Vercel Storage.'
      );
    }
    cached = neon(url);
  }
  return cached;
}

/** Helper para obtener la primera fila de un resultado Neon con tipo correcto */
export function firstRow<T>(rows: unknown): T | undefined {
  return Array.isArray(rows) ? (rows[0] as T) : undefined;
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      creado_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS fotos (
      id SERIAL PRIMARY KEY,
      evento_id TEXT NOT NULL REFERENCES eventos(id),
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      public_id TEXT,
      subido_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_fotos_evento ON fotos(evento_id)`;
}
