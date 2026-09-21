import express from 'express'
import cors from 'cors'
import canvasRouter from './canvas/canvas.routes.js'
import authRouter from './auth/auth.routes.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)
app.use(express.json({ limit: '2mb' }))

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'OK' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/canvases', canvasRouter)

app.use(notFound)
app.use(errorHandler)

export default app