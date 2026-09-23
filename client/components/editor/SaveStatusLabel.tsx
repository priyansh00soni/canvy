'use client'

import type { SaveStatus } from '@/types/canvas'
import styles from './SaveStatusLabel.module.css'

type SaveStatusLabelProps = {
  status: SaveStatus
  hasUnsavedChanges: boolean
}

export default function SaveStatusLabel({ status, hasUnsavedChanges }: SaveStatusLabelProps) {
  if (status === 'saving') {
    return <span className={styles.label}>Saving…</span>
  }
  if (status === 'saved' && !hasUnsavedChanges) {
    return (
      <span className={`${styles.label} ${styles.saved}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Saved
      </span>
    )
  }
  if (status === 'failed') {
    return <span className={`${styles.label} ${styles.failed}`}>Failed to save</span>
  }
  if (hasUnsavedChanges) {
    return <span className={styles.label}>Unsaved changes</span>
  }
  return null
}
