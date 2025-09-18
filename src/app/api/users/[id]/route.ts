import { NextRequest, NextResponse } from 'next/server'
import { kratosClient } from '@/lib/kratos'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const resolvedParams = await params
  try {
    const identity = await kratosClient.getIdentity(resolvedParams.id)
    return NextResponse.json({ identity })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const resolvedParams = await params
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const updateRequest = {
      schema_id: 'default',
      traits: {
        email,
        name: name || email.split('@')[0],
      },
    }

    const identity = await kratosClient.updateIdentity(resolvedParams.id, updateRequest)
    
    return NextResponse.json({ identity })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const resolvedParams = await params
  try {
    await kratosClient.deleteIdentity(resolvedParams.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}