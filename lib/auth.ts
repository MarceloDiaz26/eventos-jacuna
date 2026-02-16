import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'jacuna-admin-secret-cambiar'
);
const COOKIE_NAME = 'admin_token';

export async function createAdminToken(): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);
  return token;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export function getCookieConfig() {
  return {
    name: COOKIE_NAME,
    maxAge: 60 * 60 * 24, // 24 horas
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}
