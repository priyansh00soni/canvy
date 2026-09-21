import express from 'express'
import cors from 'cors'
import canvasRoutes from './canvas/canvas.routes.js'
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

app.use('/api/canvases', canvasRoutes)

app.use(notFound)
app.use(errorHandler)

export default app