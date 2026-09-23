'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getStoredToken, setStoredToken, clearStoredToken } from '@/lib/token'
import { fetchCurrentUser, loginWithGoogleIdToken } from '@/lib/authApi'
import type { User } from '@/types/auth'

type AuthContextValue = {
  user: User | null
  isCheckingSession: boolean
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken()
      if (!token) {
        setIsCheckingSession(false)
        return
      }
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        // Token was rejected or expired. apiGet already cleared it on a 401.
        clearStoredToken()
      } finally {
        setIsCheckingSession(false)
      }
    }
    restoreSession()
  }, [])

  const loginWithGoogle = async (idToken: string) => {
    const loginResult = await loginWithGoogleIdToken(idToken)
    setStoredToken(loginResult.accessToken)
    setUser(loginResult.user)
  }

  const logout = () => {
    clearStoredToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isCheckingSession, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
