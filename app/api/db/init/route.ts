import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ ok: true, message: 'Base de datos inicializada' });
  } catch (error) {
    console.error('initDb error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Error al inicializar la base de datos',
        detalle: msg,
      },
      { status: 500 }
    );
  }
}
