import { NextRequest, NextResponse } from 'next/server';
import { getSql, initDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await initDb();
    const sql = getSql();
    const rows = await sql`SELECT * FROM eventos ORDER BY creado_at DESC`;
    const eventos = Array.isArray(rows) ? rows : [];
    return NextResponse.json(eventos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const sql = getSql();
    const body = await request.json();
    const { nombre, descripcion } = body;

    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const id = uuidv4();
    await sql`
      INSERT INTO eventos (id, nombre, descripcion)
      VALUES (${id}, ${nombre.trim()}, ${descripcion?.trim() || ''})
    `;

    return NextResponse.json({ id, nombre, descripcion });
  } catch (error) {
    console.error('Error al crear evento:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const userMsg =
      msg.includes('DATABASE_URL') ? 'Base de datos no configurada. Revisá Neon en Vercel.'
      : msg.includes('relation') ? 'Tablas no creadas. Visitá /api/db/init primero.'
      : msg.includes('connect') || msg.includes('ECONNREFUSED') ? 'Error de conexión a la base de datos.'
      : 'Error al crear evento';
    return NextResponse.json({ error: userMsg }, { status: 500 });
  }
}
