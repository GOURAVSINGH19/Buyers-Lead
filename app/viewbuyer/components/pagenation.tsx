'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationNavProps {
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  currentFilters: {
    search: string;
    city: string;
    propertyType: string;
    status: string;
    timeline: string;
  };
}

export default function PaginationNav({ pagination, currentFilters }: PaginationNavProps) {
  const { page, pages } = pagination;
  const searchParams = useSearchParams();

  const makeLink = (targetPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (currentFilters.search) params.set('search', currentFilters.search);
    else params.delete('search');
    if (currentFilters.city && currentFilters.city !== 'all') params.set('city', currentFilters.city);
    else params.delete('city');
    if (currentFilters.propertyType && currentFilters.propertyType !== 'all') params.set('propertyType', currentFilters.propertyType);
    else params.delete('propertyType');
    if (currentFilters.status && currentFilters.status !== 'all') params.set('status', currentFilters.status);
    else params.delete('status');
    if (currentFilters.timeline && currentFilters.timeline !== 'all') params.set('timeline', currentFilters.timeline);
    else params.delete('timeline');

    params.set('page', targetPage.toString());
    return `/buyers?${params.toString()}`;
  };

  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {page > 1 && (
        <Link href={makeLink(page - 1)} className="px-3 py-1 border rounded">Previous</Link>
      )}
      {pagesArray.map(p => (
        <Link
          key={p}
          href={makeLink(p)}
          className={`px-3 py-1 border rounded ${p === page ? 'bg-gray-200' : ''}`}
        >
          {p}
        </Link>
      ))}
      {page < pages && (
        <Link href={makeLink(page + 1)} className="px-3 py-1 border rounded">Next</Link>
      )}
    </div>
  );
}
