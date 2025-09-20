import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LoginForm from '@/components/LoginForm'
import ThemeToggle from '@/components/ThemeToggle'

export default async function LoginPage() {
  // Check if user is already authenticated
  const sessionCookie = (await cookies()).get('kratos-session-token')

  if (sessionCookie) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kratos Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Identity Management</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Access the admin dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 shadow-modern dark:shadow-dark rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="px-6 py-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}