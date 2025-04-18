import express from 'express'
import clientRoutes from './routes/clientRoutes.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', authMiddleware, taskRoutes)
app.use('/api/clients', authMiddleware, clientRoutes)
app.use('/api/dashboard', authMiddleware, dashboardRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})