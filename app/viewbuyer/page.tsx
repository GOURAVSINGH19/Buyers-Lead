'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'
import { BuyersHeader } from './components/buyers-header'
import { BuyersTable } from './components/buyers-table'
import { BuyersFilters } from './components/buyers-filters'

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: '',
    city: 'all',
    propertyType: 'all',
    status: 'all',
    timeline: 'all',
  })

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/buyers',{params:filters})
      setBuyers(res.data.buyers)
    } catch (err) {
      console.error('Error fetching buyers:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setFilters(prev => ({ ...prev, search: val })), 10),
    []
  )

  const clearFilters = () => {
    setFilters({
      search: '',
      city: 'all',
      propertyType: 'all',
      status: 'all',
      timeline: 'all',
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.city !== 'all' ||
    filters.propertyType !== 'all' ||
    filters.status !== 'all' ||
    filters.timeline !== 'all'

  const filteredData = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch = buyer.fullName.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCity = filters.city === 'all' || buyer.city === filters.city
      const matchesType = filters.propertyType === 'all' || buyer.propertyType === filters.propertyType
      const matchesStatus = filters.status === 'all' || buyer.status === filters.status
      const matchesTimeline = filters.timeline === 'all' || buyer.timeline === filters.timeline
      return matchesSearch && matchesCity && matchesType && matchesStatus && matchesTimeline
    })
  }, [buyers, filters])

  return (
    <div className="container mx-auto py-8 px-3">
      <BuyersHeader />
      <Suspense fallback={<div className='w-full h-full flex justify-center items-center'>Loading...</div>}>
        <BuyersFilters
          filters={filters}
          onSearchChange={debouncedSetSearch}
          onFilterChange={(key: string, val: string) => setFilters(prev => ({ ...prev, [key]: val }))}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <BuyersTable data={filteredData} />
      </Suspense>
    </div>
  )
}
