import { apiGet, apiPost } from './api'
import type { LoginResponse, User } from '@/types/auth'

export const loginWithGoogleIdToken = (idToken: string): Promise<LoginResponse> => {
  return apiPost<LoginResponse>('/auth/google', { idToken }, false)
}

export const fetchCurrentUser = (): Promise<User> => {
  return apiGet<User>('/auth/me')
}
