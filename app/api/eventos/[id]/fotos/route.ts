import { NextRequest, NextResponse } from 'next/server';
import { firstRow, getSql, initDb } from '@/lib/db';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const sql = getSql();
    const { id } = await params;
    const rows = await sql`
      SELECT * FROM fotos WHERE evento_id = ${id} ORDER BY subido_at DESC
    `;
    const fotos = Array.isArray(rows) ? rows : [];
    return NextResponse.json(fotos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener fotos' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const sql = getSql();
    const { id } = await params;

    const eventoRows = await sql`SELECT * FROM eventos WHERE id = ${id}`;
    if (!Array.isArray(eventoRows) || eventoRows.length === 0) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary no está configurado. Agregá las variables en .env' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('foto') as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No se envió ninguna foto' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const mimeType = file.type || 'image/jpeg';

    const { url, public_id } = await uploadToCloudinary(buffer, filename, mimeType, id);
    const inserted = await sql`
      INSERT INTO fotos (evento_id, filename, url, public_id)
      VALUES (${id}, ${filename}, ${url}, ${public_id})
      RETURNING *
    `;

    const foto = firstRow<{ id: number; evento_id: string; filename: string; url: string; public_id?: string }>(inserted);
    if (!foto) {
      return NextResponse.json({ error: 'Error al guardar foto' }, { status: 500 });
    }
    return NextResponse.json(foto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al subir foto' }, { status: 500 });
  }
}
