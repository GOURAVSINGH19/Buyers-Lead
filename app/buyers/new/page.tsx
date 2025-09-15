import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BuyerForm } from '../components/buyer-form'
import axios from 'axios'

export default async function NewBuyerPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Buyer Lead</h1>
          <p className="text-gray-600">Fill in the details to create a new buyer lead</p>
        </div>
        <BuyerForm />
      </div>
    </div>
  )
}
