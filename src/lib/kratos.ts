// Kratos API client and types

export const KRATOS_ADMIN_URL = process.env.KRATOS_ADMIN_URL || 'http://localhost:4434'
export const KRATOS_PUBLIC_URL = process.env.KRATOS_PUBLIC_URL || 'http://localhost:4433'

// Kratos Identity types based on default schema
export interface KratosIdentity {
  id: string
  schema_id: string
  schema_url: string
  state: 'active' | 'inactive'
  state_changed_at: string
  traits: {
    email: string
    name?: {
      first?: string
      last?: string
    }
  }
  verifiable_addresses: Array<{
    id: string
    value: string
    verified: boolean
    via: string
    status: string
    created_at: string
    updated_at: string
  }>
  recovery_addresses: Array<{
    id: string
    value: string
    via: string
    created_at: string
    updated_at: string
  }>
  metadata_public: Record<string, unknown>
  metadata_admin: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateIdentityRequest {
  schema_id: string
  traits: {
    email: string
    name?: string
  }
  credentials?: {
    password?: {
      config: {
        password: string
      }
    }
  }
  verifiable_addresses?: Array<{
    value: string
    verified: boolean
    via: string
  }>
  recovery_addresses?: Array<{
    value: string
    via: string
  }>
}

export interface KratosListResponse {
  identities: KratosIdentity[]
  total_count?: number
}

// Kratos API client
export class KratosClient {
  private baseURL: string

  constructor(baseURL: string = KRATOS_ADMIN_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Kratos API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // List identities with pagination and filtering
  async listIdentities(params?: {
    page?: number
    per_page?: number
    page_size?: number,
    search?: string
    status?: 'active' | 'inactive' | 'verified' | 'unverified' | 'all'
  }): Promise<{ identities: KratosIdentity[], total_count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString())
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString())

    const endpoint = `/admin/identities${searchParams.toString() ? `?${searchParams}` : ''}`
    const identities = await this.request<KratosIdentity[]>(endpoint)

    // Client-side filtering since Kratos doesn't support advanced search
    let filteredIdentities = identities

    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredIdentities = filteredIdentities.filter(identity =>
        identity.traits.email?.toLowerCase().includes(searchTerm) ||
        identity.traits.name?.first?.toLowerCase().includes(searchTerm) ||
        identity.traits.name?.last?.toLowerCase().includes(searchTerm)
      )
    }

    if (params?.status && params.status !== 'all') {
      switch (params.status) {
        case 'active':
          filteredIdentities = filteredIdentities.filter(identity => identity.state === 'active')
          break
        case 'inactive':
          filteredIdentities = filteredIdentities.filter(identity => identity.state === 'inactive')
          break
        case 'verified':
          filteredIdentities = filteredIdentities.filter(identity =>
            identity.verifiable_addresses.some(addr => addr.verified)
          )
          break
        case 'unverified':
          filteredIdentities = filteredIdentities.filter(identity =>
            !identity.verifiable_addresses.some(addr => addr.verified)
          )
          break
      }
    }
    return {
      identities: filteredIdentities,
      total_count: filteredIdentities.length
    }
  }

  // Get single identity
  async getIdentity(id: string): Promise<KratosIdentity> {
    return this.request<KratosIdentity>(`/admin/identities/${id}`)
  }

  // Create identity
  async createIdentity(data: CreateIdentityRequest): Promise<KratosIdentity> {
    return this.request<KratosIdentity>('/admin/identities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Update identity
  async updateIdentity(id: string, data: Partial<CreateIdentityRequest>): Promise<KratosIdentity> {
    return this.request<KratosIdentity>(`/admin/identities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Delete identity
  async deleteIdentity(id: string): Promise<void> {
    await this.request<void>(`/admin/identities/${id}`, {
      method: 'DELETE',
    })
  }
}

// Default client instance
export const kratosClient = new KratosClient()
