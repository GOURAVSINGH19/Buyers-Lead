'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'

interface BuyerHistoryProps {
  history: Array<{
    id: string
    changedAt: Date
    diff: any
    changer: { name: string | null; email: string }
  }>
}

export function BuyerHistory({ history }: BuyerHistoryProps) {
  const formatFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      city: 'City',
      propertyType: 'Property Type',
      bhk: 'BHK',
      purpose: 'Purpose',
      budgetMin: 'Budget Min',
      budgetMax: 'Budget Max',
      timeline: 'Timeline',
      source: 'Source',
      status: 'Status',
      notes: 'Notes',
      tags: 'Tags'
    }
    return fieldMap[field] || field
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'None'
    if (Array.isArray(value)) return value.join(', ')
    return String(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Changes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No changes recorded</p>
        ) : (
          <div className="space-y-4">
            {history.map((change) => (
              <div key={change.id} className="border-l-2 border-blue-200 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">
                      {change.changer.name || change.changer.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(change.changedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {change.diff.action === 'created' ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Created
                  </Badge>
                ) : change.diff.action === 'imported' ? (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Imported
                  </Badge>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(change.diff).map(([field, changeData]: [string, any]) => (
                      <div key={field} className="text-sm">
                        <span className="font-medium">{formatFieldName(field)}:</span>{' '}
                        <span className="text-red-600 line-through">
                          {formatValue(changeData.from)}
                        </span>{' '}
                        →{' '}
                        <span className="text-green-600 font-medium">
                          {formatValue(changeData.to)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
