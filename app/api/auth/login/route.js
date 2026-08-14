import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'maestro2026';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = cookies();
      cookieStore.set('auto_maestro_session', 'authenticated', {
        path: '/',
        maxAge: 86400, // 24 hours
        httpOnly: false, // Kept false so document.cookie can read/clear it on client transitions
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
