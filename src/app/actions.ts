'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { kratosClient, CreateIdentityRequest, LoginSubmission } from '@/lib/kratos'

export async function createUserAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const createRequest: CreateIdentityRequest = {
    schema_id: 'default',
    traits: {
      email,
      name: {
        first: firstName || email.split('@')[0],
        last: lastName || '',
      }
    },
    credentials: {
      password: {
        config: {
          password,
        },
      },
    },
    verifiable_addresses: [
      {
        value: email,
        verified: false,
        via: 'email',
      },
    ],
    recovery_addresses: [
      {
        value: email,
        via: 'email',
      },
    ],
  }

  const result = await kratosClient.createIdentity(createRequest)
    .catch(error => {
      console.error('Error creating user:', error)
      return {
        error: error.message?.includes('duplicate') || error.message?.includes('409')
          ? 'User with this email already exists'
          : 'Failed to create user. Please try again.'
      }
    })

  if ('error' in result) {
    return result
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?created=true')
}

export async function updateUserAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const id = formData.get('id') as string
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!id || !email) {
    return { error: 'User ID and email are required' }
  }

  const updateRequest = {
    schema_id: 'default',
    traits: {
      email,
      name: {
        first: firstName || email.split('@')[0],
        last: lastName || '',
      }
    },
  }

  const result = await kratosClient.updateIdentity(id, updateRequest)
    .catch(error => {
      console.error('Error updating user:', error)
      return {
        error: error.message?.includes('duplicate') || error.message?.includes('409')
          ? 'Another user with this email already exists'
          : 'Failed to update user. Please try again.'
      }
    })

  if ('error' in result) {
    return result
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?updated=true')
}

export async function deleteUserAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const id = formData.get('id') as string

  if (!id) {
    return { error: 'User ID is required' }
  }

  const result = await kratosClient.deleteIdentity(id)
    .catch(error => {
      console.error('Error deleting user:', error)
      return {
        error: error.message?.includes('404')
          ? 'User not found'
          : 'Failed to delete user. Please try again.'
      }
    })

  if (result && typeof result === 'object' && 'error' in result) {
    return result
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?deleted=true')
}

export async function searchAction(formData: FormData) {
  const search = formData.get('search') as string
  const status = formData.get('status') as string

  const params = new URLSearchParams()

  if (search) {
    params.set('search', search)
  }

  if (status && status !== 'all') {
    params.set('status', status)
  }

  // Reset to page 1 when searching
  params.set('page', '1')

  const queryString = params.toString()
  redirect(`/dashboard${queryString ? `?${queryString}` : ''}`)
}

export async function paginateAction(formData: FormData) {
  const page = formData.get('page') as string
  const currentSearch = formData.get('currentSearch') as string
  const currentStatus = formData.get('currentStatus') as string

  const params = new URLSearchParams()

  if (page) {
    params.set('page', page)
  }

  if (currentSearch) {
    params.set('search', currentSearch)
  }

  if (currentStatus && currentStatus !== 'all') {
    params.set('status', currentStatus)
  }

  const queryString = params.toString()
  redirect(`/dashboard${queryString ? `?${queryString}` : ''}`)
}

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rememberMe = formData.get('remember-me') === 'on'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Step 1: Initialize login flow
    const loginFlow = await kratosClient.initializeLoginFlow()

    // Step 2: Extract CSRF token from flow
    const csrfNode = loginFlow.ui.nodes.find(
      node => node.attributes.name === 'csrf_token'
    )
    const csrfToken = csrfNode?.attributes.value as string

    // Step 3: Submit login credentials
    const loginSubmission: LoginSubmission = {
      method: 'password',
      password_identifier: email,
      password,
      ...(csrfToken && { csrf_token: csrfToken })
    }

    const loginResponse = await kratosClient.submitLogin(loginFlow.id, loginSubmission)

    // Step 4: Set session cookie with Kratos session token
    const cookieStore = await cookies()
    const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day

    // Use the session token from Kratos
    const sessionToken = loginResponse.session_token || loginResponse.session.id

    cookieStore.set('kratos-session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionDuration / 1000, // Convert to seconds
    })

    // Set activity tracking cookie for inactivity expiration
    cookieStore.set('kratos-last-activity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionDuration / 1000,
    })

    redirect('/dashboard')

  } catch (error) {
    console.error('Login error:', error)

    // Parse Kratos error for better user feedback
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message.split('Login failed: ')[1] || error.message)
        if (errorData.ui?.messages) {
          const errorMessage = errorData.ui.messages
            .filter((msg: { type: string; text: string }) => msg.type === 'error')
            .map((msg: { type: string; text: string }) => msg.text)
            .join(', ')

          if (errorMessage) {
            return { error: errorMessage }
          }
        }
      } catch {
        // Fall through to generic error
      }
    }

    return { error: 'Invalid email or password' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('kratos-session-token')?.value

  try {
    if (sessionToken) {
      // Initialize logout flow with Kratos
      const logoutFlow = await kratosClient.initializeLogoutFlow(sessionToken)

      // Submit logout
      await kratosClient.submitLogout(logoutFlow.logout_token)
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Continue with local cleanup even if Kratos logout fails
  }

  // Clear local cookies
  cookieStore.delete('kratos-session-token')
  cookieStore.delete('kratos-last-activity')

  redirect('/login')
}
