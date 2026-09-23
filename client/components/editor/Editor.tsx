'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Konva from 'konva'
import CanvasStage from './CanvasStageClient'
import EditorDock from './EditorDock'
import PropertiesPanel from './PropertiesPanel'
import SaveStatusLabel from './SaveStatusLabel'
import LoginModal from '../auth/LoginModal'
import MyCanvasesPanel from '../canvases/MyCanvasesPanel'
import { useEditorState } from '@/hooks/useEditorState'
import { useAuth } from '@/hooks/useAuth'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { saveNewCanvas, updateExistingCanvas, fetchCanvasById } from '@/lib/canvasApi'
import { ApiRequestError } from '@/lib/api'
import type { SaveStatus, CanvasElement } from '@/types/canvas'
import styles from './Editor.module.css'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const DEFAULT_CANVAS_NAME = 'Untitled canvas'

type EditorProps = {
  initialCanvasId?: string
}

export type ToolMode = 'select' | 'pen'

export default function Editor({ initialCanvasId }: EditorProps) {
  const { user, isCheckingSession, loginWithGoogle, logout } = useAuth()
  const editorState = useEditorState([])
  const stageRef = useRef<Konva.Stage | null>(null)

  const [tool, setTool] = useState<ToolMode>('select')
  const [canvasId, setCanvasId] = useState<string | null>(null)
  const [canvasName, setCanvasName] = useState(DEFAULT_CANVAS_NAME)
  const [savedCanvasName, setSavedCanvasName] = useState(DEFAULT_CANVAS_NAME)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCanvasesPanelOpen, setIsCanvasesPanelOpen] = useState(false)
  const [canvasesRefreshToken, setCanvasesRefreshToken] = useState(0)
  const [loginError, setLoginError] = useState<string | null>(null)

  useUnsavedChangesWarning(editorState.hasUnsavedChanges || canvasName !== savedCanvasName)

  const pendingSaveAfterLogin = useRef(false)

  const selectedElement =
  editorState.elements.find((element) => element.id === editorState.selectedElementId) ?? null

  useEffect(() => {
    if (!initialCanvasId) return

    const loadInitialCanvas = async () => {
      try {
        const loadedCanvas = await fetchCanvasById(initialCanvasId)
        editorState.loadElements(loadedCanvas.elements)
        setCanvasId(loadedCanvas._id)
        setCanvasName(loadedCanvas.name)
        setSavedCanvasName(loadedCanvas.name)
        setSaveStatus('saved')
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setSaveError(error.message)
        } else {
          setSaveError('Could not open that canvas.')
        }
      }
    }

    loadInitialCanvas()
  }, [initialCanvasId, editorState.loadElements])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName
      const isTypingInField = activeTag === 'INPUT' || activeTag === 'TEXTAREA'
      if (isTypingInField) return

      switch (event.key.toLowerCase()) {
        case 'z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            if (event.shiftKey) {
              editorState.redo()
            } else {
              editorState.undo()
            }
          }
          break
        case 'v':
          setTool('select')
          break
        case 'p':
          setTool('pen')
          break
        case 'r':
          setTool('select')
          editorState.addElement('rect', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
        case 'c':
          setTool('select')
          editorState.addElement('circle', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
        case 't':
          setTool('select')
          editorState.addElement('text', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
        case 'e':
          setTool('select')
          editorState.addElement('ellipse', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
        case 'y':
          setTool('select')
          editorState.addElement('triangle', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
        case 's':
          setTool('select')
          editorState.addElement('star', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editorState])

  const performSave = useCallback(async () => {
    setSaveStatus('saving')
    setSaveError(null)
    try {
      if (canvasId) {
        const updated = await updateExistingCanvas(canvasId, {
          name: canvasName,
          elements: editorState.elements,
        })
        setCanvasId(updated._id)
        setSavedCanvasName(canvasName)
      } else {
        const created = await saveNewCanvas({
          name: canvasName,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          elements: editorState.elements,
        })
        setCanvasId(created._id)
        setSavedCanvasName(canvasName)
      }
      editorState.markSaved()
      setSaveStatus('saved')
      setCanvasesRefreshToken((token) => token + 1)
    } catch (error) {
      setSaveStatus('failed')
      if (error instanceof ApiRequestError) {
        setSaveError(error.message)
      } else {
        setSaveError('Something went wrong while saving.')
      }
    }
  }, [canvasId, canvasName, editorState])

  const exportToPng = useCallback(() => {
    if (!stageRef.current) return
    const prevSelected = editorState.selectedElementId
    editorState.selectElement(null)
    
    // Wait for the next frame so the transformer is hidden
    setTimeout(() => {
      if (!stageRef.current) return
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${canvasName || 'canvas'}.png`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      editorState.selectElement(prevSelected)
    }, 50)
  }, [canvasName, editorState])

  const handleSaveClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    performSave()
  }

  const handleCredential = async (idToken: string) => {
    setLoginError(null)
    try {
      await loginWithGoogle(idToken)
      pendingSaveAfterLogin.current = true
      setIsLoginModalOpen(false)
    } catch {
      setLoginError('Google sign-in failed. Please try again.')
    }
  }

  // Runs the save that was waiting on authentication, right after the
  // modal closes and the user is set.
  useEffect(() => {
    if (user && pendingSaveAfterLogin.current) {
      pendingSaveAfterLogin.current = false
      performSave()
    }
  }, [user, performSave])

  const handleOpenCanvas = async (idToOpen: string) => {
    try {
      const loadedCanvas = await fetchCanvasById(idToOpen)
      editorState.loadElements(loadedCanvas.elements)
      setCanvasId(loadedCanvas._id)
      setCanvasName(loadedCanvas.name)
      setSavedCanvasName(loadedCanvas.name)
      setSaveStatus('saved')
      setIsCanvasesPanelOpen(false)
    } catch {
      setSaveError('Could not open that canvas.')
    }
  }

  const handleStartNewCanvas = () => {
    editorState.loadElements([])
    setCanvasId(null)
    setCanvasName(DEFAULT_CANVAS_NAME)
    setSavedCanvasName(DEFAULT_CANVAS_NAME)
    setSaveStatus('idle')
  }

  const handlePropertyChange = (changes: Partial<CanvasElement>) => {
    if (!editorState.selectedElementId) return
    editorState.updateElementProperty(editorState.selectedElementId, changes)
  }

  const handleDeleteSelected = () => {
    if (!editorState.selectedElementId) return
    editorState.deleteElement(editorState.selectedElementId)
  }

  return (
    <div className={styles.editorFrame}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/" className={styles.brand}>
            <span className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            Canvy
          </Link>
          <span className={styles.dot} aria-hidden="true" />
          <input
            className={styles.nameInput}
            value={canvasName}
            onChange={(event) => setCanvasName(event.target.value)}
            aria-label="Canvas name"
          />
          <SaveStatusLabel
            status={saveStatus}
            hasUnsavedChanges={editorState.hasUnsavedChanges || canvasName !== savedCanvasName}
          />
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.iconButtonGroup}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={editorState.undo}
              disabled={!editorState.canUndo}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={editorState.redo}
              disabled={!editorState.canRedo}
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={exportToPng}
              aria-label="Export to PNG"
              title="Export as PNG"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
          <div className={styles.topBarDivider} />
          
          <button type="button" className={styles.textButton} onClick={handleStartNewCanvas}>
            New
          </button>
          {!isCheckingSession && user && (
            <button type="button" className={styles.textButton} onClick={() => setIsCanvasesPanelOpen(true)}>
              My canvases
            </button>
          )}
          {!isCheckingSession && user && (
            <div className={styles.userChip}>
              {user.profilePictureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profilePictureUrl} alt="" className={styles.avatar} />
              )}
              <span>{user.name}</span>
              <button type="button" className={styles.logoutButton} onClick={logout}>
                Log out
              </button>
            </div>
          )}
          {!isCheckingSession && !user && (
            <button
              type="button"
              className={styles.signInButton}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSaveClick}
            disabled={saveStatus === 'saving'}
          >
            Save
          </button>
        </div>
      </div>

      <div className={styles.workspace}>
        <EditorDock
          tool={tool}
          onChangeTool={setTool}
          onAddElement={(type) => editorState.addElement(type, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)}
          onDeleteSelected={handleDeleteSelected}
          hasSelection={Boolean(editorState.selectedElementId)}
        />

        <div className={styles.canvasArea}>
          <div className={styles.canvasSheet} style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, cursor: tool === 'pen' ? 'crosshair' : undefined }}>
            {(() => {
              let sizeLabel = null
              if (selectedElement) {
                if (selectedElement.type === 'rect') {
                  sizeLabel = `${Math.round(selectedElement.width || 0)} × ${Math.round(selectedElement.height || 0)}`
                } else if (selectedElement.type === 'circle' || selectedElement.type === 'triangle') {
                  const d = Math.round((selectedElement.radius || 0) * 2)
                  sizeLabel = `${d} × ${d}`
                } else if (selectedElement.type === 'ellipse') {
                  sizeLabel = `${Math.round((selectedElement.radiusX || 0) * 2)} × ${Math.round((selectedElement.radiusY || 0) * 2)}`
                } else if (selectedElement.type === 'star') {
                  const d = Math.round((selectedElement.outerRadius || 0) * 2)
                  sizeLabel = `${d} × ${d}`
                }
              }

              return sizeLabel ? (
                <div className={styles.sizeIndicator}>{sizeLabel}</div>
              ) : null
            })()}
            {editorState.elements.length === 0 && (
              <div className={styles.emptyCanvasMessage}>
                Select a shape from the left tray to get started.
              </div>
            )}
            <CanvasStage
              forwardedStageRef={stageRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              tool={tool}
              elements={editorState.elements}
              selectedElementId={editorState.selectedElementId}
              onSelectElement={editorState.selectElement}
              onDragEnd={editorState.updateElementPosition}
              onTransformEnd={editorState.updateElementTransform}
              onDeleteSelected={handleDeleteSelected}
              onDrawStart={editorState.startDrawing}
              onDrawMove={editorState.continueDrawing}
              onDrawEnd={editorState.finishDrawing}
            />
          </div>
        </div>

        <PropertiesPanel
          tool={tool}
          selectedElement={selectedElement}
          onChange={handlePropertyChange}
          penSettings={editorState.penSettings}
          onPenSettingsChange={editorState.setPenSettings}
        />
      </div>

      {saveError && <p className={styles.errorBanner}>{saveError}</p>}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onCredential={handleCredential}
        errorMessage={loginError}
      />

      <MyCanvasesPanel
        isOpen={isCanvasesPanelOpen}
        onClose={() => setIsCanvasesPanelOpen(false)}
        onOpenCanvas={handleOpenCanvas}
        refreshToken={canvasesRefreshToken}
      />
    </div>
  )
}
