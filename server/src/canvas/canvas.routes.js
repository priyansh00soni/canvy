import { Router } from 'express'
import * as canvasController from './canvas.controller.js'
import {createCanvasSchema,updateCanvasSchema} from './canvas.validationSchema.js'
import validateBody from '../middleware/validateBody.js'
import authenticate from '../middleware/authenticate.js'

const canvasRouter = Router()

canvasRouter.use(authenticate)

canvasRouter
    .route('/')
    .post(validateBody(createCanvasSchema), canvasController.handleCreateCanvas)
    .get(canvasController.handleListCanvases)

canvasRouter
    .route('/:id')
    .get(canvasController.handleGetCanvas)
    .put(validateBody(updateCanvasSchema), canvasController.handleUpdateCanvas)
    .delete(canvasController.handleDeleteCanvas)

export default canvasRouter