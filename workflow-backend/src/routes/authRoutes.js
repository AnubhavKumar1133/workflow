import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)
    try {
        const insertUser = await prisma.user.create({
            data: { username, password: hashedPassword }
        })
        const token = jwt.sign({ id: insertUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.status(503).json({ message: 'User registration failed' })
    }
})

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const getUser = await prisma.user.findUnique({ where: { username } })
        if (!getUser) return res.status(404).json({ message: 'User not found' })
        const passwordIsValid = bcrypt.compareSync(password, getUser.password)
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' })

        const token = jwt.sign({ id: getUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.status(503).json({ message: 'Login failed' })
    }
})

// POST /auth/logout — (optional with stateless JWT)
router.post('/logout', (req, res) => {
    // Frontend should just delete the token; this is mostly symbolic in JWT stateless auth
    res.json({ message: 'Logged out successfully' })
})

// GET /auth/me — return current user info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, username: true } // don't send password
        })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(503).json({ message: 'Could not fetch user info' })
    }
})

export default router
