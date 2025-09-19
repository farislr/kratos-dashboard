'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { kratosClient, CreateIdentityRequest } from '@/lib/kratos'

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
