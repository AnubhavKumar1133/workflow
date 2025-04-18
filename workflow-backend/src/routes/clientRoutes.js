import express from 'express'
import prisma from '../prismaClient.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Middleware to require authentication
router.use(authMiddleware)

// Get all clients for the logged-in user
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { userId: req.userId },
        })
        res.json(clients)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching clients' })
    }
})

// Get a single client by ID (only if it belongs to the user)
router.get('/:id', async (req, res) => {
    try {
        const client = await prisma.client.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId,
            },
        })
        if (!client) {
            return res.status(404).json({ message: 'Client not found' })
        }
        res.json(client)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching client' })
    }
})

// Create a new client
router.post('/', async (req, res) => {
    const { name, email, company, notes } = req.body

    if (!name) return res.status(400).json({ message: 'Name is required' })

    try {
        const newClient = await prisma.client.create({
            data: {
                userId: req.userId,
                name,
                email,
                company,
                notes,
            },
        })
        res.status(201).json(newClient)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error creating client' })
    }
})

// Update a client
router.put('/:id', async (req, res) => {
    const { name, email, company, notes } = req.body

    try {
        // Ensure the client belongs to the user
        const existing = await prisma.client.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId,
            },
        })

        if (!existing) {
            return res.status(404).json({ message: 'Client not found' })
        }

        const updated = await prisma.client.update({
            where: { id: existing.id },
            data: {
                name: name ?? existing.name,
                email: email ?? existing.email,
                company: company ?? existing.company,
                notes: notes ?? existing.notes,
            },
        })

        res.json(updated)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error updating client' })
    }
})

// Delete a client
router.delete('/:id', async (req, res) => {
    try {
        const result = await prisma.client.deleteMany({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId,
            },
        })

        if (result.count === 0) {
            return res.status(404).json({ message: 'Client not found or unauthorized' })
        }

        res.json({ message: 'Client deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error deleting client' })
    }
})

// Get all the tasks for a specific client
router.get('/:id/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                clientId: parseInt(req.params.id),
                userId: req.userId,
            },
        })
        res.json(tasks)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching tasks' })
    }
})

export default router
