import { redirect } from 'next/navigation'
import BuyersPage from './buyers/page'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin')
  }
  return (
    <BuyersPage />
  )
}
