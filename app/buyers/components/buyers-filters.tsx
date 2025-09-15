'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { cityLabels, propertyTypeLabels, statusLabels, timelineLabels } from '@/lib/validations/buyer'
import axios from 'axios'
import debounce from "lodash/debounce"

export function BuyersFilters() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [status, setStatus] = useState('all')
  const [timeline, setTimeline] = useState('all')
  const [buyers, setBuyers] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/buyers", {
        params: {
          search: search || undefined,
          city: city !== 'all' ? city : undefined,
          propertyType: propertyType !== 'all' ? propertyType : undefined,
          status: status !== 'all' ? status : undefined,
          timeline: timeline !== 'all' ? timeline : undefined,
        },
      })
      setBuyers(response.data.buyers)
    } catch (error) {
      console.error("Error fetching buyers:", error)
    }
  }

  const debouncedFetch = useMemo(
    () =>
      debounce(() => {
        fetchData();
      }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch();
    return () => {
      debouncedFetch.cancel();
    };
  }, [search, city, propertyType, status, timeline]);


  const clearFilters = () => {
    setSearch('')
    setCity('all')
    setPropertyType('all')
    setStatus('all')
    setTimeline('all')
  }

  const hasActiveFilters = search || (city && city !== 'all') || (propertyType && propertyType !== 'all') || (status && status !== 'all') || (timeline && timeline !== 'all')

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={city} onValueChange={setCity}>
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

        <Select value={propertyType} onValueChange={setPropertyType}>
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

        <Select value={status} onValueChange={setStatus}>
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

        <Select value={timeline} onValueChange={setTimeline}>
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
