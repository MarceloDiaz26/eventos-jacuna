import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, getCookieConfig } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Admin no configurado. Agregá ADMIN_PASSWORD en .env' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = await createAdminToken();
    const config = getCookieConfig();

    (await cookies()).set(config.name, token, {
      maxAge: config.maxAge,
      httpOnly: config.httpOnly,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
