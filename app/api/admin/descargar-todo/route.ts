import { NextRequest, NextResponse } from 'next/server';
import { getSql, initDb } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import archiver from 'archiver';

export const dynamic = 'force-dynamic';

interface Foto {
  id: number;
  evento_id: string;
  filename: string;
  url: string;
}

interface Evento {
  id: string;
  nombre: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await initDb();
    const sql = getSql();
    const eventos = (await sql`SELECT * FROM eventos`) as Evento[];
    const fotos = (await sql`
      SELECT * FROM fotos ORDER BY evento_id, subido_at
    `) as Foto[];

    if (fotos.length === 0) {
      return NextResponse.json({ error: 'No hay fotos para descargar' }, { status: 404 });
    }

    const buffers: { name: string; buffer: Buffer }[] = [];
    const eventoMap = new Map(eventos.map((e) => [e.id, e.nombre]));

    for (let i = 0; i < fotos.length; i++) {
      const f = fotos[i];
      const eventoNombre = (eventoMap.get(f.evento_id) || f.evento_id).replace(/[^a-zA-Z0-9-_]/g, '_');
      const ext = f.filename.includes('.') ? f.filename.split('.').pop() : 'jpg';
      const name = `${eventoNombre}/foto-${String(i + 1).padStart(3, '0')}.${ext}`;
      try {
        const imgRes = await fetch(f.url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        buffers.push({ name, buffer });
      } catch (err) {
        console.error('Error descargando:', f.url, err);
      }
    }

    const archive = archiver('zip', { zlib: { level: 6 } });

    const readableStream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        archive.on('end', () => controller.close());
        archive.on('error', (err) => controller.error(err));

        buffers.forEach(({ name, buffer }) => archive.append(buffer, { name }));
        archive.finalize();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="album-todos-eventos.zip"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al descargar' }, { status: 500 });
  }
}
