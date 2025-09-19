'use client'

import { useSearchParams } from 'next/navigation'
import { paginateAction } from '@/app/actions'

interface PaginationProps {
  currentPage: number
  totalUsers: number
  perPage: number
}

export function Pagination({ currentPage, totalUsers, perPage }: PaginationProps) {
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalUsers / perPage)
  const currentSearch = searchParams.get('search') || ''
  const currentStatus = searchParams.get('status') || 'all'


  // Don't show pagination if there's only one page or less
  if (totalPages <= 1) {
    return null
  }

  // Calculate page range to show
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if we have 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, current page area, and last page with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        pages.push(1, 2, 3, 4)
        if (totalPages > 5) pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1)
        if (totalPages > 5) pages.push('...')
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // In the middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, totalUsers)

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile pagination */}
        <form action={paginateAction} style={{ display: 'inline' }}>
          <input type="hidden" name="page" value={currentPage - 1} />
          <input type="hidden" name="currentSearch" value={currentSearch} />
          <input type="hidden" name="currentStatus" value={currentStatus} />
          <button
            type="submit"
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
        </form>
        <form action={paginateAction} style={{ display: 'inline' }} className="ml-3">
          <input type="hidden" name="page" value={currentPage + 1} />
          <input type="hidden" name="currentSearch" value={currentSearch} />
          <input type="hidden" name="currentStatus" value={currentStatus} />
          <button
            type="submit"
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </form>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalUsers}</span> results
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous button */}
            <form action={paginateAction} style={{ display: 'inline' }}>
              <input type="hidden" name="page" value={currentPage - 1} />
              <input type="hidden" name="currentSearch" value={currentSearch} />
              <input type="hidden" name="currentStatus" value={currentStatus} />
              <button
                type="submit"
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                )
              }
              
              const pageNumber = page as number
              const isCurrentPage = pageNumber === currentPage
              
              return (
                <form action={paginateAction} style={{ display: 'inline' }} key={pageNumber}>
                  <input type="hidden" name="page" value={pageNumber} />
                  <input type="hidden" name="currentSearch" value={currentSearch} />
                  <input type="hidden" name="currentStatus" value={currentStatus} />
                  <button
                    type="submit"
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      isCurrentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </form>
              )
            })}

            {/* Next button */}
            <form action={paginateAction} style={{ display: 'inline' }}>
              <input type="hidden" name="page" value={currentPage + 1} />
              <input type="hidden" name="currentSearch" value={currentSearch} />
              <input type="hidden" name="currentStatus" value={currentStatus} />
              <button
                type="submit"
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </nav>
        </div>
      </div>
    </div>
  )
}