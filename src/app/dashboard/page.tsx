import { kratosClient, KratosIdentity } from '@/lib/kratos'
import { UserTable } from '@/components/UserTable'
import { AddUserForm } from '@/components/AddUserForm'
import { SearchAndFilters } from '@/components/SearchAndFilters'
import { Pagination } from '@/components/Pagination'
import LogoutButton from '@/components/LogoutButton'

import ThemeToggle from '@/components/ThemeToggle'

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: 'active' | 'inactive' | 'verified' | 'unverified' | 'all'
  }>
}

export default async function DashboardPage({ searchParams: sParams }: DashboardPageProps) {
  const searchParams = await sParams;
  // Parse search parameters
  const currentPage = parseInt(searchParams.page || '1')
  const perPage = 20
  const pageSize = perPage
  const search = searchParams.search
  const status = searchParams.status || 'all'

  // Fetch users server-side with filtering
  let users: KratosIdentity[] = []
  let totalCount = 0
  let error: string | null = null

  try {
    const result = await kratosClient.listIdentities({
      page: currentPage,
      per_page: perPage,
      page_size: pageSize,
      search,
      status
    })
    users = result.identities
    totalCount = result.total_count || users.length
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error = 'Failed to load users. Please check your Kratos connection.'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Manage user identities through Ory Kratos
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <LogoutButton />
              <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                Import CSV
              </button>
              <AddUserForm />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Users
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Users
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter(u => u.state === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Verified
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter(u => u.verifiable_addresses.some(addr => addr.verified)).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.7m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17.4 15m-2.4-2v-5" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Inactive
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter(u => u.state === 'inactive').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilters />

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white">
                Users {search && `(filtered by "${search}")`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalCount} total users
              </p>
            </div>
          </div>
          <UserTable users={users} />
          <Pagination
            currentPage={currentPage}
            totalUsers={totalCount}
            perPage={perPage}
          />
        </div>
      </div>
    </div>
  )
}
