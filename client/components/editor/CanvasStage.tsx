'use client'

import { useRef, useEffect } from 'react'
import { Stage, Layer, Transformer } from 'react-konva'
import Konva from 'konva'
import ShapeNode from './ShapeNode'
import type { CanvasElement } from '@/types/canvas'
import type { ToolMode } from './Editor'

type CanvasStageProps = {
  width: number
  height: number
  tool?: ToolMode
  elements: CanvasElement[]
  selectedElementId: string | null
  onSelectElement: (elementId: string | null) => void
  onDragEnd: (elementId: string, x: number, y: number) => void
  onTransformEnd: (elementId: string, x: number, y: number, rotation: number, size: Partial<CanvasElement>) => void
  onDeleteSelected: () => void
  onDrawStart?: (x: number, y: number) => string
  onDrawMove?: (elementId: string, x: number, y: number) => void
  onDrawEnd?: () => void
  forwardedStageRef?: React.MutableRefObject<Konva.Stage | null>
}

export default function CanvasStage({
  width,
  height,
  elements,
  selectedElementId,
  onSelectElement,
  onDragEnd,
  onTransformEnd,
  onDeleteSelected,
  tool = 'select',
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  forwardedStageRef,
}: CanvasStageProps) {
  const transformerRef = useRef<Konva.Transformer | null>(null)
  const shapeRefs = useRef<Map<string, Konva.Node>>(new Map())
  const stageRef = useRef<Konva.Stage | null>(null)
  
  const isDrawingRef = useRef(false)
  const currentDrawIdRef = useRef<string | null>(null)

  const selectedElement = elements.find((e) => e.id === selectedElementId)

  // Attach the Transformer to whichever node is currently selected, and
  // detach it entirely when nothing is selected, rather than leaving a
  // stale empty box on the canvas.
  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return

    if (tool !== 'select' || !selectedElementId) {
      transformer.nodes([])
      transformer.getLayer()?.batchDraw()
      return
    }

    const selectedNode = shapeRefs.current.get(selectedElementId)
    if (selectedNode) {
      transformer.nodes([selectedNode])
      transformer.getLayer()?.batchDraw()
    }
  }, [selectedElementId, elements])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName
      const isTypingInField = activeTag === 'INPUT' || activeTag === 'TEXTAREA'
      if (isTypingInField) return
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
        event.preventDefault()
        onDeleteSelected()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, onDeleteSelected])

  const handleStageMouseDown = (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool === 'pen') {
      if (!onDrawStart) return
      isDrawingRef.current = true
      const pos = event.target.getStage()?.getPointerPosition()
      if (pos) {
        currentDrawIdRef.current = onDrawStart(pos.x, pos.y)
      }
      return
    }

    const clickedOnEmptyArea = event.target === event.target.getStage()
    if (clickedOnEmptyArea) {
      onSelectElement(null)
    }
  }

  const handleStageMouseMove = (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== 'pen' || !isDrawingRef.current || !currentDrawIdRef.current || !onDrawMove) return
    const pos = event.target.getStage()?.getPointerPosition()
    if (pos) {
      onDrawMove(currentDrawIdRef.current, pos.x, pos.y)
    }
  }

  const handleStageMouseUp = () => {
    if (tool === 'pen' && isDrawingRef.current && onDrawEnd) {
      onDrawEnd()
    }
    isDrawingRef.current = false
    currentDrawIdRef.current = null
  }

  // Konva's Transformer resizes by changing scaleX/scaleY on the node, it
  // never touches width/height/radius directly. If we saved scale as-is,
  // every future drag or reload would compound it. So on transform end we
  // multiply the scale into the real dimension, then reset scale to 1 both
  // on the node and in the value we hand back to React state.
  const handleTransformEnd = (elementId: string, node: Konva.Node) => {
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)

    const element = elements.find((candidate) => candidate.id === elementId)
    if (!element) return

    if (element.type === 'rect') {
      const nextWidth = Math.max(20, (element.width || 120) * scaleX)
      const nextHeight = Math.max(20, (element.height || 80) * scaleY)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        width: nextWidth,
        height: nextHeight,
      })
      return
    }

    if (element.type === 'text') {
      const maxScale = Math.max(Math.abs(scaleX), Math.abs(scaleY))
      const nextFontSize = Math.max(8, (element.fontSize || 24) * maxScale)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        fontSize: Math.round(nextFontSize),
      })
      return
    }

    if (element.type === 'circle') {
      const averageScale = (scaleX + scaleY) / 2
      const nextRadius = Math.max(10, (element.radius || 50) * averageScale)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        radius: nextRadius,
      })
      return
    }

    if (element.type === 'ellipse') {
      const nextRadiusX = Math.max(10, (element.radiusX || 60) * Math.abs(scaleX))
      const nextRadiusY = Math.max(10, (element.radiusY || 40) * Math.abs(scaleY))
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        radiusX: nextRadiusX,
        radiusY: nextRadiusY,
      })
      return
    }

    if (element.type === 'triangle') {
      const averageScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2
      const nextRadius = Math.max(10, (element.radius || 50) * averageScale)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        radius: nextRadius,
      })
      return
    }

    if (element.type === 'star') {
      const averageScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2
      const nextInner = Math.max(5, (element.innerRadius || 25) * averageScale)
      const nextOuter = Math.max(10, (element.outerRadius || 50) * averageScale)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        innerRadius: nextInner,
        outerRadius: nextOuter,
      })
      return
    }

    if (element.type === 'pen') {
      const newPoints = element.points.map((p, index) => {
        return index % 2 === 0 ? p * scaleX : p * scaleY
      })
      const averageScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2
      const nextStrokeWidth = Math.max(1, (element.strokeWidth || 4) * averageScale)
      onTransformEnd(elementId, node.x(), node.y(), node.rotation(), {
        points: newPoints,
        strokeWidth: nextStrokeWidth,
      })
      return
    }
  }

  return (
    <Stage
      ref={(node) => {
        stageRef.current = node
        if (forwardedStageRef) {
          forwardedStageRef.current = node
        }
      }}
      width={width}
      height={height}
      onMouseDown={handleStageMouseDown}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
      onTouchStart={handleStageMouseDown}
      onTouchMove={handleStageMouseMove}
      onTouchEnd={handleStageMouseUp}
    >
      <Layer>
        {elements.map((element) => (
          <ShapeNode
            key={element.id}
            element={element}
            tool={tool}
            isSelected={element.id === selectedElementId}
            onSelect={() => onSelectElement(element.id)}
            onDragEnd={(x, y) => onDragEnd(element.id, x, y)}
            onTransformEnd={(node) => handleTransformEnd(element.id, node)}
            shapeRef={(node) => {
              if (node) {
                shapeRefs.current.set(element.id, node)
              } else {
                shapeRefs.current.delete(element.id)
              }
            }}
          />
        ))}
        <Transformer
          ref={transformerRef}
          rotateEnabled
          borderStroke="#4056e8"
          borderStrokeWidth={1.5}
          anchorStroke="#4056e8"
          anchorFill="#ffffff"
          anchorSize={8}
          anchorCornerRadius={2}
          rotateAnchorOffset={24}
          boundBoxFunc={(oldBox, newBox) => {
            const rad = (newBox.rotation || 0) * Math.PI / 180
            const cos = Math.cos(rad)
            const sin = Math.sin(rad)
            const getPoint = (px: number, py: number) => ({
              x: newBox.x + px * cos - py * sin,
              y: newBox.y + px * sin + py * cos
            })
            const pts = [
              getPoint(0, 0),
              getPoint(newBox.width, 0),
              getPoint(newBox.width, newBox.height),
              getPoint(0, newBox.height)
            ]
            const minX = Math.min(...pts.map(p => p.x))
            const minY = Math.min(...pts.map(p => p.y))
            const maxX = Math.max(...pts.map(p => p.x))
            const maxY = Math.max(...pts.map(p => p.y))

            if (minX < 0 || minY < 0 || maxX > width || maxY > height) {
              return oldBox
            }
            return newBox
          }}
          keepRatio={selectedElement?.type === 'text' || selectedElement?.type === 'circle'}
          enabledAnchors={
            selectedElement?.type === 'text'
              ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
              : ['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left']
          }
        />
      </Layer>
    </Stage>
  )
}
