'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Delete } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Buyer } from '@prisma/client'
import { cityLabels, propertyTypeLabels, statusLabels, timelineLabels } from '@/lib/validations/buyer'

interface BuyersTableProps {
  buyers: Buyer[]
}

export function BuyersTable({ buyers }: BuyersTableProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return '-'
    if (!min) return `Up to ${formatCurrency(max!)}`
    if (!max) return `${formatCurrency(min)}+`
    return `${formatCurrency(min)} - ${formatCurrency(max)}`
  }



  return (
    <Table className='mb-100'>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Property Type</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buyers?.map((buyer) => (
          <TableRow key={buyer.id}>
            <TableCell className="font-medium">{buyer.fullName}</TableCell>
            <TableCell>{buyer.phone}</TableCell>
            <TableCell>{cityLabels[buyer.city]}</TableCell>
            <TableCell>{propertyTypeLabels[buyer.propertyType]}</TableCell>
            <TableCell>{formatBudget(buyer.budgetMin, buyer.budgetMax)}</TableCell>
            <TableCell>{timelineLabels[buyer.timeline]}</TableCell>
            <TableCell>
              <Badge variant={buyer.status === 'CONVERTED' ? 'default' : 'secondary'}>
                {statusLabels[buyer.status]}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(buyer.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/buyers/${buyer.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
