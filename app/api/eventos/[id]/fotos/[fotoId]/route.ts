import { NextRequest, NextResponse } from 'next/server';
import { firstRow, getSql, initDb } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { deleteFromCloudinary, extractPublicIdFromUrl, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fotoId: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await initDb();
    const sql = getSql();
    const { id, fotoId } = await params;

    const fotoRows = await sql`
      SELECT * FROM fotos WHERE id = ${parseInt(fotoId, 10)} AND evento_id = ${id}
    `;
    const foto = firstRow<{ url: string; public_id?: string | null }>(fotoRows);

    if (!foto) {
      return NextResponse.json({ error: 'Foto no encontrada' }, { status: 404 });
    }

    if (isCloudinaryConfigured()) {
      const publicId = foto.public_id || extractPublicIdFromUrl(foto.url);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error('Error eliminando de Cloudinary:', err);
        }
      }
    }

    await sql`DELETE FROM fotos WHERE id = ${parseInt(fotoId, 10)}`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar foto' }, { status: 500 });
  }
}
