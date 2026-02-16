import { NextRequest, NextResponse } from 'next/server';
import { firstRow, getSql, initDb } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { deleteFromCloudinary, extractPublicIdFromUrl, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const sql = getSql();
    const { id } = await params;
    const rows = await sql`SELECT * FROM eventos WHERE id = ${id}`;
    const evento = firstRow<{ id: string; nombre: string; descripcion?: string }>(rows);

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener evento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await initDb();
    const sql = getSql();
    const { id } = await params;
    const eventoRows = await sql`SELECT * FROM eventos WHERE id = ${id}`;
    const evento = firstRow<{ id: string }>(eventoRows);

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    if (isCloudinaryConfigured()) {
      const fotos = (await sql`SELECT * FROM fotos WHERE evento_id = ${id}`) as { url: string; public_id?: string | null }[];
      for (const f of fotos) {
        const publicId = f.public_id || extractPublicIdFromUrl(f.url);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (err) {
            console.error('Error eliminando de Cloudinary:', err);
          }
        }
      }
    }

    await sql`DELETE FROM fotos WHERE evento_id = ${id}`;
    await sql`DELETE FROM eventos WHERE id = ${id}`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }
}
