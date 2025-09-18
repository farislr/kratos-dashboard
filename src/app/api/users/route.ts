import { NextRequest, NextResponse } from 'next/server'
import { kratosClient, CreateIdentityRequest } from '@/lib/kratos'

// GET /api/users - List users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
    const per_page = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined
    const page_size = searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : undefined
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') as 'active' | 'inactive' | 'verified' | 'unverified' | 'all' || undefined

    const result = await kratosClient.listIdentities({ page, per_page, page_size, search, status })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const createRequest: CreateIdentityRequest = {
      schema_id: 'default',
      traits: {
        email,
        name: name || email.split('@')[0], // Use email prefix as default name
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

    const identity = await kratosClient.createIdentity(createRequest)


    return NextResponse.json({ identity }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
