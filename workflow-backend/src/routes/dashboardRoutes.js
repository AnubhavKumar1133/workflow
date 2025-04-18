import express from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    const userId = req.userId

    try {
        const [total, completed, inProgress, pending] = await Promise.all([
            prisma.task.count({ where: { userId } }),
            prisma.task.count({ where: { userId, status: 'completed' } }),
            prisma.task.count({ where: { userId, status: 'inProgress' } }),
            prisma.task.count({ where: { userId, status: 'pending' } }),
        ])

        const priorities = await prisma.task.groupBy({
            by: ['priority'],
            where: { userId },
            _count: true,
        })

        const priorityStats = {
            high: 0,
            medium: 0,
            low: 0,
        }
        priorities.forEach((item) => {
            priorityStats[item.priority] = item._count
        })

        const clients = await prisma.client.findMany({
            where: { userId },
            include: {
                tasks: {
                    where: {
                        completed: false,
                    },
                },
            },
        })

        const clientStats = {
            total: clients.length,
            withActiveTasks: clients.filter(client => client.tasks.length > 0).length,
        }

        res.json({
            taskStats: {
                total,
                completed,
                inProgress,
                pending,
            },
            priorityStats,
            clientStats,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' })
    }
})

// GET /api/dashboard/upcoming
router.get('/upcoming', async (req, res) => {
    const userId = req.userId

    try {
        const upcomingDeadlines = await prisma.task.findMany({
            where: {
                userId,
                due_date: {
                    not: null,
                },
                completed: false,
            },
            orderBy: {
                due_date: 'asc',
            },
            select: {
                id: true,
                title: true,
                due_date: true,
                priority: true,
                status: true,
                client: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        res.json(upcomingDeadlines)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch upcoming deadlines' })
    }
})

export default router
