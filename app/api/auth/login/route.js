import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '../../../../lib/auth-helper';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'maestro2026';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = cookies();
      cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  } catch (error) {
    console.error('Server auth error:', error);
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}
