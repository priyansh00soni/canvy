'use client'

import { useState } from 'react'
import CanvasStage from '../editor/CanvasStageClient'
import type { CanvasElement } from '@/types/canvas'

type DemoCanvasStageProps = {
  width: number
  height: number
  initialElements: CanvasElement[]
  initialSelectedId?: string | null
  interactive?: boolean
}

// The landing page shows the actual editor's Stage/Transformer/shape
// rendering in a small read-only or lightly-interactive frame, rather than
// a screenshot, so the marketing surface and the product never drift apart.
export default function DemoCanvasStage({
  width,
  height,
  initialElements,
  initialSelectedId = null,
  interactive = true,
}: DemoCanvasStageProps) {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId)

  const handleDragEnd = (elementId: string, x: number, y: number) => {
    if (!interactive) return
    setElements((current) =>
      current.map((element) => (element.id === elementId ? Object.assign({}, element, { x, y }) : element))
    )
  }

  const handleTransformEnd = (
    elementId: string,
    x: number,
    y: number,
    rotation: number,
    size: Partial<CanvasElement>
  ) => {
    if (!interactive) return
    setElements((current) =>
      current.map((element) =>
        element.id === elementId ? Object.assign({}, element, size, { x, y, rotation }) : element
      )
    )
  }

  return (
    <CanvasStage
      width={width}
      height={height}
      elements={elements}
      selectedElementId={interactive ? selectedId : null}
      onSelectElement={interactive ? setSelectedId : () => undefined}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onDeleteSelected={() => undefined}
    />
  )
}
