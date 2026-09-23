'use client'

import { useRef } from 'react'

import { Rect, Circle, Text, Ellipse, RegularPolygon, Star, Line } from 'react-konva'
import Konva from 'konva'
import type { CanvasElement } from '@/types/canvas'
import type { ToolMode } from './Editor'

type ShapeNodeProps = {
  element: CanvasElement
  tool: ToolMode
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (node: Konva.Node) => void
  shapeRef: (node: Konva.Node | null) => void
}

// Renders one canvas element as the matching Konva shape. Drag position is
// only written back to React state on drag end, not on every pointer move,
// so re-renders stay cheap while the user is actively moving something.
// Each branch lists its own props explicitly rather than sharing a spread
// object, since react-konva components do not all accept the same prop set.
export default function ShapeNode({
  element,
  tool,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  shapeRef,
}: ShapeNodeProps) {
  const nodeRef = useRef<Konva.Node | null>(null)
  
  const handleRef = (node: Konva.Node | null) => {
    nodeRef.current = node
    shapeRef(node)
  }

  const handleDragEnd = (event: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(event.target.x(), event.target.y())
  }

  const handleTransformEnd = (event: Konva.KonvaEventObject<Event>) => {
    onTransformEnd(event.target)
  }

  const handleDragBound = (pos: Konva.Vector2d) => {
    const node = nodeRef.current
    if (!node) return pos

    const box = node.getClientRect()
    const dx = pos.x - node.x()
    const dy = pos.y - node.y()

    const proposedLeft = box.x + dx
    const proposedTop = box.y + dy
    const proposedRight = box.x + box.width + dx
    const proposedBottom = box.y + box.height + dy

    let newX = pos.x
    let newY = pos.y

    if (box.width <= 800) {
      if (proposedLeft < 0) newX -= proposedLeft
      if (proposedRight > 800) newX -= (proposedRight - 800)
    }

    if (box.height <= 600) {
      if (proposedTop < 0) newY -= proposedTop
      if (proposedBottom > 600) newY -= (proposedBottom - 600)
    }

    return { x: newX, y: newY }
  }

  const idleStrokeColor = 'rgba(21, 22, 26, 0.08)'

  if (element.type === 'rect') {
    return (
      <Rect
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        fill={element.fill}
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
        width={element.width || 120}
        height={element.height || 80}
        cornerRadius={4}
        stroke={isSelected ? undefined : idleStrokeColor}
        strokeWidth={isSelected ? 0 : 1}
      />
    )
  }

  if (element.type === 'circle') {
    return (
      <Circle
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        fill={element.fill}
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
        radius={element.radius || 50}
        stroke={isSelected ? undefined : idleStrokeColor}
        strokeWidth={isSelected ? 0 : 1}
      />
    )
  }

  if (element.type === 'ellipse') {
    return (
      <Ellipse
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        fill={element.fill}
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
        radiusX={element.radiusX || 60}
        radiusY={element.radiusY || 40}
        stroke={isSelected ? undefined : idleStrokeColor}
        strokeWidth={isSelected ? 0 : 1}
      />
    )
  }

  if (element.type === 'triangle') {
    return (
      <RegularPolygon
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        fill={element.fill}
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
        sides={3}
        radius={element.radius || 50}
        stroke={isSelected ? undefined : idleStrokeColor}
        strokeWidth={isSelected ? 0 : 1}
      />
    )
  }

  if (element.type === 'star') {
    return (
      <Star
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        fill={element.fill}
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
        numPoints={element.numPoints || 5}
        innerRadius={element.innerRadius || 25}
        outerRadius={element.outerRadius || 50}
        stroke={isSelected ? undefined : idleStrokeColor}
        strokeWidth={isSelected ? 0 : 1}
      />
    )
  }

  if (element.type === 'pen') {
    return (
      <Line
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        points={element.points || []}
        stroke={element.stroke || element.fill}
        strokeWidth={element.strokeWidth || 4}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        draggable={tool !== 'pen'}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={handleDragBound}
        ref={handleRef}
        perfectDrawEnabled={false}
      />
    )
  }

  return (
    <Text
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      fill={element.fill}
      draggable={tool !== 'pen'}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      dragBoundFunc={handleDragBound}
      ref={handleRef}
      perfectDrawEnabled={false}
      text={element.text || 'Think creatively'}
      fontSize={element.fontSize || 24}
      fontFamily="Instrument Sans, sans-serif"
      width={element.width}
    />
  )
}
