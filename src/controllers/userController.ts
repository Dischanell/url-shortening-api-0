import { Request, Response } from 'express'
import Users from '../models/Users'
import Sessions from '../models/Sessions'
import { Types } from 'mongoose'
import { isEmail, isStrongPassword } from 'validator'


export async function handleTemporaryUserRegistration(req: Request, res: Response){
    try {
        const user = await Users.create({})

        const userId = user._id
        const userIp = req.ip ?? ''
        const userAgent = req.headers['user-agent'] ?? ''

        const session = await createSession(userId, userIp, userAgent)

        const sessionId = session.sessionId

        res.cookie("sessionId", sessionId)

        res.status(200).json({ message: 'Temporary user registered correctly' })
    } catch(e) {
        console.error(e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function handleUserRegistration(req: Request, res: Response){
    const { email, password } = req.body
    const { sessionId } = req.cookies

    try {
        const isValidEmail = isEmail(email)
        const isValidPassword = isStrongPassword(password)
        if (!isValidEmail || !isValidPassword) return res.status(400).json({ message: 'Invalid email or password' })

        const session = await Sessions.findOne({ sessionId: sessionId })
        if (!session) return res.status(404).json({ message: 'Session not found' })

        const userId = session.userId

        await updateUser(userId, email, password)

        res.status(200).json({ message: 'User registered correctly' })
    } catch(e) {
        console.error(e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function handleUserLogin(req: Request, res: Response){
    const { email, password } = req.body

    try {
        const user = await Users.findOne({ email: email })
        if (!user) return res.status(401).json({ message: 'Invalid email or password' })

        const isCorrectPassword = await user.isCorrectPassword(password)
        if (!isCorrectPassword) return res.status(401).json({ message: 'Invalid email or password' })

        const userId = user._id
        const userIp = req.ip ?? ''
        const userAgent = req.headers['user-agent'] ?? ''

        const session = await createSession(userId, userIp, userAgent)
        const sessionId = session.sessionId

        res.cookie("sessionId", sessionId)
        res.status(200).json({ message: 'Login successful' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Internal server error' })
    }    
}

async function createSession(userId: Types.ObjectId, userIp: string, userAgent: string){
    const session = await Sessions.create({
        userId,
        userIp,
        userAgent,
    })

    return session
}

async function updateUser(userId: Types.ObjectId, email: string, password: string){
    const user = await Users.findOne({ _id: userId })
    if (!user) throw new Error('User not found')

    await user.updateUser(email, password)

    return user
}