import mongoose from 'mongoose'
import { Canvas } from './canvas.model.js'
import ApiError from '../utils/ApiError.js'

const isIdIsValid = (canvasId) => {
    if (!mongoose.isValidObjectId(canvasId)) throw new ApiError(400, 'Invalid canvas id')
}

export const saveNewCanvas = async (ownerId, canvasDetails) => {
    return Canvas.create({
        name: canvasDetails.name,
        width: canvasDetails.width,
        height: canvasDetails.height,
        elements: canvasDetails.elements,
        owner: ownerId,
    })
}

export const fetchAllCanvasSummaries = async (ownerId) => {
    return Canvas.find({ owner: ownerId }).select('-elements').sort({ updatedAt: -1 })
}

export const fetchCanvas = async (ownerId, canvasId) => {
    isIdIsValid(canvasId)
    const foundCanvas = await Canvas.findOne({ _id: canvasId, owner: ownerId })
    if (!foundCanvas) throw new ApiError(404, 'Canvas not found')
    return foundCanvas
}

export const saveChanges = async (ownerId, canvasId, updatedDetails) => {
    isIdIsValid(canvasId)
    const updatedCanvas = await Canvas.findOneAndUpdate(
        { _id: canvasId, owner: ownerId },
        updatedDetails,
        { new: true, runValidators: true }
    )
    if (!updatedCanvas) throw new ApiError(404, 'Canvas not found')
    return updatedCanvas
}

export const removeCanvas = async (ownerId, canvasId) => {
    isIdIsValid(canvasId)
    const removedCanvas = await Canvas.findOneAndDelete({ _id: canvasId, owner: ownerId })
    if (!removedCanvas) throw new ApiError(404, 'Canvas not found')
    return removedCanvas
}