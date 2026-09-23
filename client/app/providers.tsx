'use client'

import { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '@/hooks/useAuth'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  )
}
