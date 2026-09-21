import * as canvasService from './canvas.service.js'

export const handleCreateCanvas = async (req, res, next) => {
    try {
        const newCanvas = await canvasService.saveNewCanvas(req.user._id, req.body)
        res.status(201).json({ success: true, data: newCanvas })
    } catch (error) {
        next(error)
    }
}

export const handleListCanvases = async (req, res, next) => {
    try {
        const canvasSummaries = await canvasService.fetchAllCanvasSummaries(req.user._id)
        res.status(200).json({ success: true, data: canvasSummaries })
    } catch (error) {
        next(error)
    }
}

export const handleGetCanvas = async (req, res, next) => {
    try {
        const canvas = await canvasService.fetchCanvas(req.user._id, req.params.id)
        res.status(200).json({ success: true, data: canvas })
    } catch (error) {
        next(error)
    }
}

export const handleUpdateCanvas = async (req, res, next) => {
    try {
        const updatedCanvas = await canvasService.saveChanges(req.user._id, req.params.id, req.body)
        res.status(200).json({ success: true, data: updatedCanvas })
    } catch (error) {
        next(error)
    }
}

export const handleDeleteCanvas = async (req, res, next) => {
    try {
        await canvasService.removeCanvas(req.user._id, req.params.id)
        res.status(200).json({ success: true, message: 'Canvas deleted' })
    } catch (error) {
        next(error)
    }
}