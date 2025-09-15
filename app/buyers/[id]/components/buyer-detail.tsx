'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BuyerForm } from '../../components/buyer-form'
import { BuyerHistory } from './buyer-history'
import { Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Buyer } from '@prisma/client'
import { cityLabels, propertyTypeLabels, bhkLabels, purposeLabels, timelineLabels, sourceLabels, statusLabels } from '@/lib/validations/buyer'

interface BuyerDetailProps {
  buyer: Buyer & {
    owner: { name: string | null; email: string }
    history: Array<{
      id: string
      changedAt: Date
      diff: any
      changer: { name: string | null; email: string }
    }>
  }
}

export function BuyerDetail({ buyer }: BuyerDetailProps) {
  const [isEditing, setIsEditing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Not specified'
    if (!min) return `Up to ${formatCurrency(max!)}`
    if (!max) return `${formatCurrency(min)}+`
    return `${formatCurrency(min)} - ${formatCurrency(max)}`
  }

  if (isEditing) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to View
            </Button>
            <h1 className="text-3xl font-bold">Edit Buyer Lead</h1>
            <p className="text-gray-600">Update the buyer lead information</p>
          </div>
          <BuyerForm 
            initialData={{
              fullName: buyer.fullName,
              email: buyer.email || '',
              phone: buyer.phone,
              city: buyer.city,
              propertyType: buyer.propertyType,
              bhk: buyer.bhk || undefined,
              purpose: buyer.purpose,
              budgetMin: buyer.budgetMin || undefined,
              budgetMax: buyer.budgetMax || undefined,
              timeline: buyer.timeline,
              source: buyer.source,
              notes: buyer.notes || '',
              tags: buyer.tags
            }}
            buyerId={buyer.id}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/buyers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Link>
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{buyer.fullName}</h1>
              <p className="text-gray-600">Buyer Lead Details</p>
            </div>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg">{buyer.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg">{buyer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{buyer.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-lg">{cityLabels[buyer.city]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Property Type</label>
                    <p className="text-lg">{propertyTypeLabels[buyer.propertyType]}</p>
                  </div>
                  {buyer.bhk && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">BHK</label>
                      <p className="text-lg">{bhkLabels[buyer.bhk]}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                    <p className="text-lg">{purposeLabels[buyer.purpose]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget</label>
                    <p className="text-lg">{formatBudget(buyer.budgetMin, buyer.budgetMax)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timeline</label>
                    <p className="text-lg">{timelineLabels[buyer.timeline]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Source</label>
                    <p className="text-lg">{sourceLabels[buyer.source]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge variant={buyer.status === 'CONVERTED' ? 'default' : 'secondary'}>
                      {statusLabels[buyer.status]}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner</label>
                    <p className="text-lg">{buyer.owner.name || buyer.owner.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {buyer.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{buyer.notes}</p>
                </CardContent>
              </Card>
            )}

            {buyer.tags && buyer.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {buyer.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <BuyerHistory history={buyer.history} />
          </div>
        </div>
      </div>
    </div>
  )
}
