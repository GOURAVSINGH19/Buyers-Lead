'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cityLabels, propertyTypeLabels, statusLabels, timelineLabels } from '@/lib/validations/buyer'

interface FilterOptions {
  filters: {
    search: string
    city: string
    propertyType: string
    status: string
    timeline: string
  },
  onSearchChange: (value: string) => void,
  onFilterChange: (key: string, value: string) => void,
  clearFilters: () => void,
  hasActiveFilters: string | boolean,
}


export function BuyersFilters({
  filters,
  onSearchChange,
  onFilterChange,
  clearFilters,
  hasActiveFilters,
}: FilterOptions): React.JSX.Element {

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.city} onValueChange={(value) => onFilterChange('city', value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {Object.entries(cityLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.propertyType} onValueChange={(value) => onFilterChange('propertyType', value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.timeline} onValueChange={(value) => onFilterChange('timeline', value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timelines</SelectItem>
            {Object.entries(timelineLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
