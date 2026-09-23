export type ElementType = 'rect' | 'circle' | 'text' | 'ellipse' | 'triangle' | 'star' | 'pen'

export type CanvasElement = {
  id: string
  type: ElementType
  x: number
  y: number
  rotation: number
  fill: string
  width?: number
  height?: number
  radius?: number
  text?: string
  fontSize?: number
  radiusX?: number
  radiusY?: number
  innerRadius?: number
  outerRadius?: number
  numPoints?: number
  points?: number[]
  stroke?: string
  strokeWidth?: number
}

export type Canvas = {
  _id: string
  name: string
  width: number
  height: number
  elements: CanvasElement[]
  createdAt: string
  updatedAt: string
}

// The list endpoint returns canvases without their elements array.
export type CanvasSummary = Omit<Canvas, 'elements'>

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'failed'
