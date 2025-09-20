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
    name?: {
      first?: string
      last?: string
    },
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

// Self-service login flow types
export interface LoginFlow {
  id: string
  type: 'api' | 'browser'
  expires_at: string
  issued_at: string
  request_url: string
  ui: {
    action: string
    method: string
    nodes: Array<{
      type: 'input' | 'img' | 'a' | 'script' | 'text'
      group: 'default' | 'password' | 'oidc' | 'webauthn'
      attributes: {
        name: string
        type: string
        value?: string
        required?: boolean
        disabled?: boolean
      }
      messages?: Array<{
        id: number
        text: string
        type: 'info' | 'error' | 'success'
      }>
    }>
    messages?: Array<{
      id: number
      text: string
      type: 'info' | 'error' | 'success'
    }>
  }
}

export interface LoginSubmission {
  method: 'password'
  password_identifier: string
  password: string
  csrf_token?: string
}

export interface KratosSession {
  id: string
  active: boolean
  expires_at: string
  authenticated_at: string
  issued_at: string
  identity: KratosIdentity
}

export interface LoginResponse {
  session: KratosSession
  session_token?: string
}

export interface LogoutFlow {
  id: string
  type: 'api' | 'browser'
  expires_at: string
  issued_at: string
  request_url: string
  logout_url: string
  logout_token: string
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
      const body = await response.json()
      throw new Error(`Kratos API error: ${response.status} ${response.statusText} ${JSON.stringify(body)}`) // Include URL for easier debugging
    }

    if (response.status === 204) {
      return {} as T // Return empty object for No Content responses
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

  // Self-service login flow methods using public API
  async initializeLoginFlow(): Promise<LoginFlow> {
    const publicURL = KRATOS_PUBLIC_URL
    const response = await fetch(`${publicURL}/self-service/login/api`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to initialize login flow: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async submitLogin(flowId: string, submission: LoginSubmission): Promise<LoginResponse> {
    const publicURL = KRATOS_PUBLIC_URL
    const response = await fetch(`${publicURL}/self-service/login?flow=${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Login failed: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async whoami(sessionToken?: string): Promise<KratosSession> {
    const publicURL = KRATOS_PUBLIC_URL
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`
    }

    const response = await fetch(`${publicURL}/sessions/whoami`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Session validation failed: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async initializeLogoutFlow(sessionToken?: string): Promise<LogoutFlow> {
    const publicURL = KRATOS_PUBLIC_URL
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`
    }

    const response = await fetch(`${publicURL}/self-service/logout/api`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to initialize logout flow: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async submitLogout(logoutToken: string): Promise<void> {
    const publicURL = KRATOS_PUBLIC_URL
    const response = await fetch(`${publicURL}/self-service/logout?token=${logoutToken}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Logout failed: ${JSON.stringify(error)}`)
    }
  }
}

// Default client instance
export const kratosClient = new KratosClient()
