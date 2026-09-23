'use client'

import { useEffect } from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import styles from './LoginModal.module.css'

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
  onCredential: (idToken: string) => void
  errorMessage: string | null
}

export default function LoginModal({ isOpen, onClose, onCredential, errorMessage }: LoginModalProps) {
  // Esc closes the modal without touching editor state, matching the rule
  // that a guest can back out of saving without losing their drawing.
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    onCredential(credentialResponse.credential)
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Sign in to save your canvas">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <p className={styles.title}>Sign in to save</p>
        <p className={styles.body}>
          Your canvas stays exactly as it is. Sign in with Google and saving will continue automatically.
        </p>
        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => undefined}
            useOneTap={false}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  )
}
