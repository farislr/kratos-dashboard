import { kratosClient, KratosIdentity } from '@/lib/kratos'
import { UserTable } from '@/components/UserTable'
import { AddUserForm } from '@/components/AddUserForm'
import { SearchAndFilters } from '@/components/SearchAndFilters'
import { Pagination } from '@/components/Pagination'

interface DashboardPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: 'active' | 'inactive' | 'verified' | 'unverified' | 'all'
  }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage user identities through Ory Kratos
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Import CSV
              </button>
              <AddUserForm />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.state === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">V</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Verified
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.verifiable_addresses.some(addr => addr.verified)).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Inactive
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilters />

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Users {search && `(filtered by "${search}")`}
              </h3>
              <p className="text-sm text-gray-500">
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
