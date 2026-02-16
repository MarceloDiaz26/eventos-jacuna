import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    
    const uploadUrl = `${baseUrl}/eventos/${id}/subir`;
    
    const qrDataUrl = await QRCode.toDataURL(uploadUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });

    return new NextResponse(
      Buffer.from(qrDataUrl.split(',')[1], 'base64'),
      {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al generar QR' }, { status: 500 });
  }
}
