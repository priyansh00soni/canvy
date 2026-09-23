'use client'

import type { ElementType } from '@/types/canvas'
import type { ToolMode } from './Editor'
import { Dock, DockItem, DockLabel, DockIcon } from '../core/Dock'
import styles from './EditorDock.module.css'

type EditorDockProps = {
  tool: ToolMode
  onChangeTool: (tool: ToolMode) => void
  onAddElement: (type: ElementType) => void
  onDeleteSelected: () => void
  hasSelection: boolean
}

export default function EditorDock({ tool, onChangeTool, onAddElement, onDeleteSelected, hasSelection }: EditorDockProps) {
  return (
    <div className={styles.dockContainer}>
      <Dock className={styles.dockOverrides}>
        <DockItem
          isActive={tool === 'select'}
          onClick={() => onChangeTool('select')}
          aria-label="Select tool"
        >
          <DockLabel>Select (V)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
              <path d="M13 13l6 6" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>V</span>
        </DockItem>

        <DockItem
          isActive={tool === 'pen'}
          onClick={() => onChangeTool('pen')}
          aria-label="Pen tool"
        >
          <DockLabel>Pen (P)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>P</span>
        </DockItem>

        <div className={styles.divider} />

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('rect') }}
          aria-label="Add rectangle"
        >
          <DockLabel>Rectangle (R)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="6" width="16" height="12" rx="2" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>R</span>
        </DockItem>

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('circle') }}
          aria-label="Add circle"
        >
          <DockLabel>Circle (C)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>C</span>
        </DockItem>

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('text') }}
          aria-label="Add text"
        >
          <DockLabel>Text (T)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 6h14M12 6v13" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>T</span>
        </DockItem>

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('ellipse') }}
          aria-label="Add ellipse"
        >
          <DockLabel>Ellipse (E)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <ellipse cx="12" cy="12" rx="10" ry="6" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>E</span>
        </DockItem>

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('triangle') }}
          aria-label="Add triangle"
        >
          <DockLabel>Triangle (Y)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 3L22 20H2L12 3Z" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>Y</span>
        </DockItem>

        <DockItem
          onClick={() => { onChangeTool('select'); onAddElement('star') }}
          aria-label="Add star"
        >
          <DockLabel>Star (S)</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </DockIcon>
          <span className={styles.shortcutBadge}>S</span>
        </DockItem>

        <div className={styles.divider} />

        <DockItem
          onClick={onDeleteSelected}
          aria-label="Delete selected"
          className={!hasSelection ? styles.disabled : ''}
        >
          <DockLabel>Delete</DockLabel>
          <DockIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
            </svg>
          </DockIcon>
        </DockItem>
      </Dock>
    </div>
  )
}
