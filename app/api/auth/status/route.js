import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth-helper';

export async function GET() {
  return NextResponse.json({ authenticated: checkAuth() });
}
