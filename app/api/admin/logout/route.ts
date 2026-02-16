import { NextResponse } from 'next/server';
import { getCookieConfig } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  const config = getCookieConfig();
  (await cookies()).delete(config.name);
  return NextResponse.json({ ok: true });
}
