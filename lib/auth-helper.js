import { cookies } from 'next/headers';

export function checkAuth() {
  const cookieStore = cookies();
  const session = cookieStore.get('auto_maestro_session');
  return session?.value === 'authenticated';
}
