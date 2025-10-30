'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { redirect } from 'next/navigation'
import { BuyersHeader } from './components/buyers-header'
import { BuyersTable } from './components/buyers-table'
import { BuyersFilters } from './components/buyers-filters'
import { debounce } from 'lodash'
import axios from 'axios'

export default function BuyersPage() {

  const [buyers, setBuyers] = useState<any[]>([])
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [timeline, setTimeline] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/buyers/filter',{
        params: {
          search,
          city,
          propertyType,
          status,
          timeline
        }
      });
      setBuyers(response.data.buyers);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    setTimeline('all');
  }

  const hasActiveFilters = search || (city && city !== 'all') || (propertyType && propertyType !== 'all') || (status && status !== 'all') || (timeline && timeline !== 'all')


  const Filterdata = useMemo(() => {
    return buyers.filter((item) => {
      const matchesSearch = item.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = city ? item.city === city : true;
      const matchesStatus = status ? item.status === status : true;
      const matchpropertyType = propertyType ? item.propertyType === propertyType : true;
      return matchesSearch && matchesCategory && matchesStatus && matchpropertyType;
    });
  }, [search, city, propertyType, status, timeline]);

  return (
    <div className="container mx-auto py-8 px-3">
      <BuyersHeader />
      <Suspense fallback={<div className='w-full h-full flex justify-center items-center'>Loading...</div>}>
        <BuyersFilters
          search={search}
          onSearchChange={setSearch}
          city={city} onCityChange={setCity}
          propertyType={propertyType}
          onPropertyTypeChange={setPropertyType}
          status={status}
          onStatusChange={setStatus}
          timeline={timeline}
          onTimelineChange={setTimeline}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <BuyersTable data={Filterdata} />
        {/* <PaginationNav pagination={pagination} currentFilters={{ search, city, propertyType, status, timeline }} /> */}
      </Suspense>
    </div>
  )
}
