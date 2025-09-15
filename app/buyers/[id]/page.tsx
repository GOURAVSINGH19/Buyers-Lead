import { notFound } from 'next/navigation'
import { BuyerDetail } from './components/buyer-detail'
import axios from 'axios'

interface BuyerPageProps {
  params: { id: string }
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  try {
    const response = await axios.get(`/api/buyers/${params.id}`)
    const buyer = response.data
    return <BuyerDetail buyer={buyer} />
  } catch (error) {
    notFound()
  }
}
