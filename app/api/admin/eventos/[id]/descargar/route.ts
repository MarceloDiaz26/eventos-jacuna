import { NextRequest, NextResponse } from 'next/server';
import { firstRow, getSql, initDb } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import archiver from 'archiver';

interface Foto {
  id: number;
  filename: string;
  url: string;
}

export async function GET(
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
    const evento = firstRow<{ nombre?: string }>(eventoRows);

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const fotos = (await sql`
      SELECT * FROM fotos WHERE evento_id = ${id} ORDER BY subido_at
    `) as Foto[];

    if (fotos.length === 0) {
      return NextResponse.json({ error: 'No hay fotos para descargar' }, { status: 404 });
    }

    const sanitized = (evento.nombre || 'evento').replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `album-${sanitized}.zip`;

    const buffers: { name: string; buffer: Buffer }[] = [];
    for (let i = 0; i < fotos.length; i++) {
      const f = fotos[i];
      const ext = f.filename.includes('.') ? f.filename.split('.').pop() : 'jpg';
      const name = `foto-${String(i + 1).padStart(3, '0')}.${ext}`;
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
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al descargar' }, { status: 500 });
  }
}
