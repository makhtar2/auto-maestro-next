import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'auto_maestro_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

function getSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'maestro2026';
}

export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
