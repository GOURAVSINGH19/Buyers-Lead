import { notFound } from 'next/navigation'
import { BuyerDetail } from '../components/buyer-detail'
import axios from 'axios'

export default async function BuyerPage({ params }:{params:{id:string}}) {
  try {
    const {id} = await (params)
    const response = await (axios.get(`/api/buyers/${id}`))
    const buyer = response.data
    console.log(buyer)
    return <BuyerDetail buyer={buyer} />
  } catch (error) {
    notFound()
  }
}
