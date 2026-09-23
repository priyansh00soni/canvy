const TOKEN_KEY = 'canvy_access_token'

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string): void => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const clearStoredToken = (): void => {
  window.localStorage.removeItem(TOKEN_KEY)
}
