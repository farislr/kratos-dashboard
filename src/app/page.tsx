

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kratos Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Admin interface for Ory Kratos identity management
          </p>
          
          <div className="space-y-4">
            <a
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </a>
            
            <div className="text-sm text-gray-500">
              <p>Features:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• User management (CRUD operations)</li>
                <li>• CSV bulk import</li>
                <li>• Real-time user statistics</li>
                <li>• Identity verification status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
