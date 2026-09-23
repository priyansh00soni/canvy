'use client'

import { useState, useCallback } from 'react'
import type { CanvasElement, ElementType } from '@/types/canvas'

const SOFT_COLORS = [
  '#a3b899', // soft green
  '#61a3f5ff', // soft blue
  '#fec2c2ff', // soft pink
  '#cea9f7ff', // soft yellow
  '#ffb347', // soft orange
  '#d79cd9ff', // soft purple
  '#ff6961', // soft red
]

const getRandomSoftColor = () => SOFT_COLORS[Math.floor(Math.random() * SOFT_COLORS.length)]
const createElementId = (): string => {
  return crypto.randomUUID()
}

const buildDefaultElement = (
  type: ElementType, 
  centerX: number, 
  centerY: number,
  penSettings?: { strokeWidth: number; strokeColor: string }
): CanvasElement => {
  const fill = getRandomSoftColor()
  if (type === 'rect') {
    return {
      id: createElementId(),
      type: 'rect',
      x: centerX - 60,
      y: centerY - 40,
      rotation: 0,
      fill,
      width: 120,
      height: 80,
    }
  }
  if (type === 'circle') {
    return {
      id: createElementId(),
      type: 'circle',
      x: centerX,
      y: centerY,
      rotation: 0,
      fill,
      radius: 50,
    }
  }
  if (type === 'ellipse') {
    return {
      id: createElementId(),
      type: 'ellipse',
      x: centerX,
      y: centerY,
      rotation: 0,
      fill,
      radiusX: 60,
      radiusY: 40,
    }
  }
  if (type === 'triangle') {
    return {
      id: createElementId(),
      type: 'triangle',
      x: centerX,
      y: centerY,
      rotation: 0,
      fill,
      radius: 50,
    }
  }
  if (type === 'star') {
    return {
      id: createElementId(),
      type: 'star',
      x: centerX,
      y: centerY,
      rotation: 0,
      fill,
      innerRadius: 25,
      outerRadius: 50,
      numPoints: 5,
    }
  }
  if (type === 'pen') {
    return {
      id: createElementId(),
      type: 'pen',
      x: 0,
      y: 0,
      rotation: 0,
      fill: 'transparent',
      stroke: penSettings?.strokeColor || '#1a1a1a',
      strokeWidth: penSettings?.strokeWidth || 4,
      points: [centerX, centerY],
    }
  }
  return {
    id: createElementId(),
    type: 'text',
    x: centerX - 50,
    y: centerY - 12,
    rotation: 0,
    fill: '#15161a',
    text: 'Think creatively',
    fontSize: 24,
  }
}

export const useEditorState = (initialElements: CanvasElement[] = []) => {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [pastElements, setPastElements] = useState<CanvasElement[][]>([])
  const [futureElements, setFutureElements] = useState<CanvasElement[][]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [penSettings, setPenSettings] = useState({ strokeWidth: 4, strokeColor: '#1a1a1a' })

  const commitHistory = useCallback((newElements: CanvasElement[]) => {
    setPastElements((past) => [...past, elements])
    setFutureElements([])
  }, [elements])

  const undo = useCallback(() => {
    if (pastElements.length === 0) return
    const previous = pastElements[pastElements.length - 1]
    setPastElements((past) => past.slice(0, past.length - 1))
    setFutureElements((future) => [elements, ...future])
    setElements(previous)
    setHasUnsavedChanges(true)
  }, [elements, pastElements])

  const redo = useCallback(() => {
    if (futureElements.length === 0) return
    const next = futureElements[0]
    setFutureElements((future) => future.slice(1))
    setPastElements((past) => [...past, elements])
    setElements(next)
    setHasUnsavedChanges(true)
  }, [elements, futureElements])

  const addElement = useCallback((type: ElementType, centerX: number, centerY: number) => {
    const newElement = buildDefaultElement(type, centerX, centerY)
    setElements((currentElements) => {
      const next = currentElements.concat(newElement)
      commitHistory(next)
      return next
    })
    setSelectedElementId(newElement.id)
    setHasUnsavedChanges(true)
  }, [commitHistory])

  const startDrawing = useCallback((x: number, y: number) => {
    const newElement = buildDefaultElement('pen', x, y, penSettings)
    // Don't commit history here, wait until drawing finishes
    setElements((currentElements) => {
      setPastElements((past) => [...past, currentElements])
      setFutureElements([])
      return currentElements.concat(newElement)
    })
    setSelectedElementId(newElement.id)
    setHasUnsavedChanges(true)
    return newElement.id
  }, [penSettings])

  const continueDrawing = useCallback((elementId: string, x: number, y: number) => {
    setElements((currentElements) =>
      currentElements.map((element) => {
        if (element.id !== elementId || element.type !== 'pen') return element
        const updated = Object.assign({}, element)
        updated.points = [...(updated.points || []), x, y]
        return updated
      })
    )
    setHasUnsavedChanges(true)
  }, [])

  const finishDrawing = useCallback(() => {
    // History was recorded on startDrawing, so we don't need to commit again unless we want the final state.
    // Actually, startDrawing records the state BEFORE drawing. The current state is the end of drawing.
    // We already pushed to past in startDrawing. We are good.
  }, [])

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId)
  }, [])

  const updateElementPosition = useCallback((elementId: string, x: number, y: number) => {
    setElements((currentElements) => {
      const next = currentElements.map((element) => {
        if (element.id !== elementId) return element
        const updated = Object.assign({}, element)
        updated.x = x
        updated.y = y
        return updated
      })
      commitHistory(next)
      return next
    })
    setHasUnsavedChanges(true)
  }, [commitHistory])

  // Konva's Transformer changes a node's scale, not its stored width/height.
  // The caller is expected to have already multiplied scale into these
  // final values and reset the node's own scale back to 1.
  const updateElementTransform = useCallback(
    (elementId: string, x: number, y: number, rotation: number, size: Partial<CanvasElement>) => {
      setElements((currentElements) => {
        const next = currentElements.map((element) => {
          if (element.id !== elementId) return element
          const updated = Object.assign({}, element, size)
          updated.x = x
          updated.y = y
          updated.rotation = rotation
          return updated
        })
        commitHistory(next)
        return next
      })
      setHasUnsavedChanges(true)
    },
    [commitHistory]
  )

  const updateElementProperty = useCallback((elementId: string, changes: Partial<CanvasElement>) => {
    setElements((currentElements) => {
      const next = currentElements.map((element) => {
        if (element.id !== elementId) return element
        const updated = Object.assign({}, element, changes)

        if (updated.x !== undefined) updated.x = Math.max(0, Math.min(updated.x, 800))
        if (updated.y !== undefined) updated.y = Math.max(0, Math.min(updated.y, 600))
        
        return updated
      })
      commitHistory(next)
      return next
    })
    setHasUnsavedChanges(true)
  }, [commitHistory])

  const deleteElement = useCallback(
    (elementId: string) => {
      setElements((currentElements) => {
        const next = currentElements.filter((element) => element.id !== elementId)
        commitHistory(next)
        return next
      })
      if (selectedElementId === elementId) {
        setSelectedElementId(null)
      }
      setHasUnsavedChanges(true)
    },
    [selectedElementId, commitHistory]
  )

  const loadElements = useCallback((loadedElements: CanvasElement[]) => {
    setElements(loadedElements)
    setPastElements([])
    setFutureElements([])
    setSelectedElementId(null)
    setHasUnsavedChanges(false)
  }, [])

  const markSaved = useCallback(() => {
    setHasUnsavedChanges(false)
  }, [])

  return {
    elements,
    selectedElementId,
    hasUnsavedChanges,
    addElement,
    startDrawing,
    continueDrawing,
    finishDrawing,
    selectElement,
    updateElementPosition,
    updateElementTransform,
    updateElementProperty,
    penSettings,
    setPenSettings,
    deleteElement,
    loadElements,
    markSaved,
    undo,
    redo,
    canUndo: pastElements.length > 0,
    canRedo: futureElements.length > 0,
  }
}

export type EditorState = ReturnType<typeof useEditorState>
