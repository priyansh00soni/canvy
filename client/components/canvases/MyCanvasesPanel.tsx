'use client'

import { useEffect, useState } from 'react'
import type { CanvasSummary } from '@/types/canvas'
import { fetchCanvasSummaries, deleteCanvasById } from '@/lib/canvasApi'
import styles from './MyCanvasesPanel.module.css'

type MyCanvasesPanelProps = {
  isOpen: boolean
  onClose: () => void
  onOpenCanvas: (canvasId: string) => void
  refreshToken: number
}

type LoadState = 'loading' | 'ready' | 'error'

export default function MyCanvasesPanel({ isOpen, onClose, onOpenCanvas, refreshToken }: MyCanvasesPanelProps) {
  const [canvases, setCanvases] = useState<CanvasSummary[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    let isCancelled = false

    const loadCanvases = async () => {
      setLoadState('loading')
      try {
        const summaries = await fetchCanvasSummaries()
        if (!isCancelled) {
          setCanvases(summaries)
          setLoadState('ready')
        }
      } catch {
        if (!isCancelled) setLoadState('error')
      }
    }

    loadCanvases()
    return () => {
      isCancelled = true
    }
  }, [isOpen, refreshToken])

  const handleDelete = async (canvasId: string) => {
    setDeletingId(canvasId)
    try {
      await deleteCanvasById(canvasId)
      setCanvases((current) => current.filter((canvas) => canvas._id !== canvasId))
    } catch {
      // Leave the row in place. The person can retry the delete.
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="My canvases">
        <div className={styles.header}>
          <p className={styles.title}>My canvases</p>
          <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {loadState === 'loading' && <p className={styles.message}>Loading your canvases…</p>}

        {loadState === 'error' && (
          <p className={styles.message}>Couldn&apos;t load your canvases. Try closing and reopening this panel.</p>
        )}

        {loadState === 'ready' && canvases.length === 0 && (
          <p className={styles.message}>Nothing saved yet. Save a canvas and it will show up here.</p>
        )}

        {loadState === 'ready' && canvases.length > 0 && (
          <ul className={styles.list}>
            {canvases.map((canvas) => (
              <li key={canvas._id} className={styles.row}>
                <button type="button" className={styles.rowOpenButton} onClick={() => onOpenCanvas(canvas._id)}>
                  <span className={styles.canvasName}>{canvas.name}</span>
                  <span className={styles.canvasMeta}>
                    {canvas.width}×{canvas.height} · updated {new Date(canvas.updatedAt).toLocaleDateString()}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`Delete ${canvas.name}`}
                  disabled={deletingId === canvas._id}
                  onClick={() => handleDelete(canvas._id)}
                >
                  {deletingId === canvas._id ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
