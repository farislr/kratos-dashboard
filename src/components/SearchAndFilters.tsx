'use client'

import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { searchAction } from '@/app/actions'

function SearchButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {pending ? 'Searching...' : 'Search'}
    </button>
  )
}

export function SearchAndFilters() {
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') || ''
  const currentStatus = searchParams.get('status') || 'all'

  return (
    <div className="mb-6">
      <form action={searchAction} className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="sr-only">
            Search users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              defaultValue={currentSearch}
              placeholder="Search by email or name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <label htmlFor="status" className="sr-only">
            Filter by status
          </label>
          <select
            name="status"
            id="status"
            defaultValue={currentStatus}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>

        {/* Search Button */}
        <SearchButton />
      </form>

      {/* Clear Filters */}
      {(currentSearch || currentStatus !== 'all') && (
        <form action={searchAction} className="mt-4">
          <input type="hidden" name="search" value="" />
          <input type="hidden" name="status" value="all" />
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </form>
      )}
    </div>
  )
}