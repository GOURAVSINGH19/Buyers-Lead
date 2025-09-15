import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BuyersHeader } from './components/buyers-header'
import { getBuyersPage } from '@/lib/actions/buyer'
import PaginationNav from './components/pagenation'
import { BuyersTable } from './components/buyers-table'
import { BuyersFilters } from './components/buyers-filters'

export default async function BuyersPage(props: {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
  }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const searchParams = await props.searchParams;

  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams?.search ?? '';
  const city = searchParams?.city ?? '';
  const propertyType = searchParams?.propertyType ?? '';
  const status = searchParams?.status ?? '';
  const timeline = searchParams?.timeline ?? '';

  const { buyers, pagination } = await getBuyersPage({
    page,
    limit: 10,
    search: search || undefined,
    city: city || undefined,
    propertyType: propertyType || undefined,
    status: status || undefined,
    timeline: timeline || undefined,
  });

  return (
    <div className="container mx-auto py-8 px-3">
      <BuyersHeader />
      <Suspense fallback={<div className='w-full h-full flex justify-center items-center'>Loading...</div>}>
        <BuyersFilters />
        <BuyersTable buyers={buyers} />
        <PaginationNav pagination={pagination} currentFilters={{ search, city, propertyType, status, timeline }} />
      </Suspense>
    </div>
  )
}
