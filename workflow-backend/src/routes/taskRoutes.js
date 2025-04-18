import express from 'express'
import prisma from '../prismaClient.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
    const userId = req.userId;
    const {
        title,
        description,
        client,       // Client name (string)
        status = 'pending',
        priority = 'medium',
        deadline,     // ISO date string (YYYY-MM-DD)
        completed = false
    } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        // Find client by name if provided
        let clientId = null;
        if (client) {
            const existingClient = await prisma.client.findFirst({
                where: {
                    name: client,
                    userId: userId
                }
            });
            clientId = existingClient?.id || null;
        }

        // Create the task
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                due_date: deadline ? new Date(deadline) : null,
                completed,
                userId,
                clientId
            },
            include: {
                client: true
            }
        });

        res.status(201).json({
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            client: newTask.client?.name || null,
            clientId: newTask.clientId,
            status: newTask.status,
            priority: newTask.priority,
            deadline: newTask.due_date?.toISOString().split('T')[0] || null,
            completed: newTask.completed,
            createdAt: newTask.created_at,
            updatedAt: newTask.updatedAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// GET /api/tasks - Get all tasks with filters
router.get('/', async (req, res) => {
    const userId = req.userId;
    const {
        status,
        priority,
        client,
        search,
        sortBy = 'due_date',
        sortOrder = 'asc',
        page = 1,
        limit = 10
    } = req.query;

    // Build the where clause
    const where = {
        userId,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(client && { 
            client: {
                name: { contains: client, mode: 'insensitive' }
            }
        }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { client: { name: { contains: search, mode: 'insensitive' } } }
            ]
        })
    };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort fields
    const validSortFields = ['due_date', 'priority', 'title', 'createdAt'];
    const orderBy = validSortFields.includes(sortBy)
        ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' }
        : { createdAt: 'asc' };

    try {
        const tasks = await prisma.task.findMany({
            where,
            include: {
                client: true
            },
            orderBy,
            skip: offset,
            take: parseInt(limit)
        });

        const total = await prisma.task.count({ where });

        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            client: task.client?.name || null,
            clientId: task.clientId,
            status: task.status,
            priority: task.priority,
            deadline: task.due_date?.toISOString().split() || null,
            completed: task.completed,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }));

        res.json({
            tasks: formattedTasks,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
                userId: userId
            },
            include: {
                client: true
            }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            id: task.id,
            title: task.title,
            description: task.description,
            client: task.client?.name || null,
            clientId: task.clientId,
            status: task.status,
            priority: task.priority,
            deadline: task.due_date?.toISOString().split('T')[0] || null,
            completed: task.completed,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch task' });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id)
    const userId = req.userId

    try {
        const deletedTask = await prisma.task.deleteMany({
            where: {
                id: taskId,
                userId: userId
            }
        })

        if (deletedTask.count === 0) {
            return res.status(404).json({ message: 'Task not found or not authorized' })
        }

        res.json({ message: 'Task deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to delete task' })
    }
})

// PATCH /api/tasks/:id - Update a task
router.patch('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    const {
        title,
        description,
        status,
        priority,
        deadline  // This comes from frontend as YYYY-MM-DD
    } = req.body;

    try {
        // First verify the task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: userId
            }
        });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: title ?? existingTask.title,
                description: description ?? existingTask.description,
                status: status ?? existingTask.status,
                priority: priority ?? existingTask.priority,
                due_date: deadline ? new Date(deadline) : existingTask.due_date
                // Note: clientId is intentionally not updated
            },
            include: {
                client: true
            }
        });

        res.json({
            id: updatedTask.id,
            title: updatedTask.title,
            description: updatedTask.description,
            client: updatedTask.client?.name || null,
            status: updatedTask.status,
            priority: updatedTask.priority,
            deadline: updatedTask.due_date?.toISOString().split('T')[0] || null,
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task' });
    }
});

export default router