import { Router } from 'express'
import * as canvasController from './canvas.controller.js'
import { validateCreateCanvas, validateUpdateCanvas } from './canvas.validationSchema.js'

const canvasRouter = Router()

canvasRouter
    .route('/')
    .post(validateCreateCanvas, canvasController.handleCreateCanvas)
    .get(canvasController.handleListCanvases)

canvasRouter
    .route('/:id')
    .get(canvasController.handleGetCanvas)
    .put(validateUpdateCanvas, canvasController.handleUpdateCanvas)
    .delete(canvasController.handleDeleteCanvas)

export default canvasRouter