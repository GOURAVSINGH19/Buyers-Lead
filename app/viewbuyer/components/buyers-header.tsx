import { Button } from '@/components/ui/button'
import { Plus, Download, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function BuyersHeader() {
  const searchParams = useSearchParams()
  // const { data: session } = useSession()

  const handleExport = () => {
    const params = new URLSearchParams()
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const propertyType = searchParams.get('propertyType')
    const status = searchParams.get('status')
    const timeline = searchParams.get('timeline')

    if (search) params.set('search', search)
    if (city) params.set('city', city)
    if (propertyType) params.set('propertyType', propertyType)
    if (status) params.set('status', status)
    if (timeline) params.set('timeline', timeline)

    const queryString = params.toString()
    window.open(`/api/buyers/export${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Buyer Leads</h1>
        <p className="text-gray-600">Manage and track your buyer leads</p>
        {/* {session && (
          <p className="text-sm text-gray-500">Welcome, {session.user?.name || session.user?.email}</p>
        )} */}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button asChild>
          <Link href="/buyers/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Link>
        </Button>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
