import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-options';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return session.user;
}
