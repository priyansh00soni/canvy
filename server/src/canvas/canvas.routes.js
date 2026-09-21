import { Router } from 'express'
import * as canvasController from './canvas.controller.js'

const canvasRouter = Router()

canvasRouter
    .route('/')
    .post(canvasController.handleCreateCanvas)
    .get(canvasController.handleListCanvases)

canvasRouter
    .route('/:id')
    .get(canvasController.handleGetCanvas)
    .put(canvasController.handleUpdateCanvas)
    .delete(canvasController.handleDeleteCanvas)

export default canvasRouter