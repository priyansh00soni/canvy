import mongoose from 'mongoose'
import { Canvas } from './canvas.model.js'
import ApiError from '../utils/ApiError.js'

const isIdIsValid = (canvasId) => {
    if (!mongoose.isValidObjectId(canvasId)) throw new ApiError(400, 'Invalid canvas id')
}

export const saveNewCanvas = async (canvasDetails) => {
    return Canvas.create(canvasDetails)
}

export const fetchAllCanvasSummaries = async () => {
    return Canvas.find().select('-elements').sort({ updatedAt: -1 })
}

export const fetchCanvas = async (canvasId) => {
    isIdIsValid(canvasId)
    const foundCanvas = await Canvas.findById(canvasId)
    if (!foundCanvas) throw new ApiError(404, 'Canvas not found')
    return foundCanvas
}

export const saveChanges = async (canvasId, updatedDetails) => {
    isIdIsValid(canvasId)
    const updatedCanvas = await Canvas.findByIdAndUpdate(canvasId, updatedDetails, {
        new: true,
        runValidators: true,
    })
    if (!updatedCanvas) throw new ApiError(404, 'Canvas not found')
    return updatedCanvas
}

export const removeCanvas = async (canvasId) => {
    isIdIsValid(canvasId)
    const removedCanvas = await Canvas.findByIdAndDelete(canvasId)
    if (!removedCanvas) throw new ApiError(404, 'Canvas not found')
    return removedCanvas
}