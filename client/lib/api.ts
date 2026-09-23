import { getStoredToken, clearStoredToken } from './token'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Matches the backend's fixed response envelope. On success "data" carries
// the payload. On failure "message" is meant to be shown to the user and
// "errors" holds field-level validation messages when present.
type ApiSuccess<T> = {
  success: true
  data: T
}

type ApiFailure = {
  success: false
  message: string
  errors: string[] | Record<string, string[]>
  data: null
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export class ApiRequestError extends Error {
  status: number
  errors: string[] | Record<string, string[]>

  constructor(status: number, message: string, errors: string[] | Record<string, string[]>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  requiresAuth?: boolean
}

const sendRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const method = options.method || 'GET'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.requiresAuth) {
    const token = getStoredToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = (await response.json()) as ApiResponse<T>

  if (!payload.success) {
    if (response.status === 401) {
      clearStoredToken()
    }
    throw new ApiRequestError(response.status, payload.message, payload.errors)
  }

  return payload.data
}

export const apiGet = <T>(path: string, requiresAuth = true): Promise<T> => {
  return sendRequest<T>(path, { method: 'GET', requiresAuth })
}

export const apiPost = <T>(path: string, body: unknown, requiresAuth = true): Promise<T> => {
  return sendRequest<T>(path, { method: 'POST', body, requiresAuth })
}

export const apiPut = <T>(path: string, body: unknown, requiresAuth = true): Promise<T> => {
  return sendRequest<T>(path, { method: 'PUT', body, requiresAuth })
}

export const apiDelete = <T>(path: string, requiresAuth = true): Promise<T> => {
  return sendRequest<T>(path, { method: 'DELETE', requiresAuth })
}
