import { apiGet, apiPost, apiPut, apiDelete } from './api'
import type { Canvas, CanvasSummary, CanvasElement } from '@/types/canvas'

type CreateCanvasPayload = {
  name: string
  width?: number
  height?: number
  elements?: CanvasElement[]
}

type UpdateCanvasPayload = {
  name?: string
  width?: number
  height?: number
  elements?: CanvasElement[]
}

export const saveNewCanvas = (payload: CreateCanvasPayload): Promise<Canvas> => {
  return apiPost<Canvas>('/canvases', payload)
}

export const fetchCanvasSummaries = (): Promise<CanvasSummary[]> => {
  return apiGet<CanvasSummary[]>('/canvases')
}

export const fetchCanvasById = (canvasId: string): Promise<Canvas> => {
  return apiGet<Canvas>(`/canvases/${canvasId}`)
}

export const updateExistingCanvas = (canvasId: string, payload: UpdateCanvasPayload): Promise<Canvas> => {
  return apiPut<Canvas>(`/canvases/${canvasId}`, payload)
}

export const deleteCanvasById = (canvasId: string): Promise<{ success: boolean; message: string }> => {
  return apiDelete<{ success: boolean; message: string }>(`/canvases/${canvasId}`)
}
