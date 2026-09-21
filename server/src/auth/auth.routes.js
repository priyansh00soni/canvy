import { Router } from 'express'
import validateBody from '../middleware/validateBody.js'
import authenticate from '../middleware/authenticate.js'
import { googleLoginSchema } from './auth.validation.js'
import { handleGoogleLogin, handleGetCurrentUser } from './auth.controller.js'

const authRouter = Router()

authRouter.post('/google', validateBody(googleLoginSchema), handleGoogleLogin)
authRouter.get('/me', authenticate, handleGetCurrentUser)

export default authRouter