import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './database'
import { handleUserRegistration, handleUserLogin, handleTemporaryUserRegistration } from './controllers/userController'
import { handleRedirect, getUrls, shortenUrl, removeUrl } from './controllers/urlController'

dotenv.config()

const port = process.env.PORT

const allowedOrigins = [
    'http://localhost:5173',
    // add production frontend
]

const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET, POST',
    credentials: true
}

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

connectToDatabase()

app.post('/api/users', handleUserRegistration) // User registration
app.post('/api/users/temporary', handleTemporaryUserRegistration) // Temporary user registration

app.post('/api/sessions', handleUserLogin) // User login

app.get('/api/urls', getUrls) // Get Shortened URLs
app.post('/api/urls', shortenUrl) // Shorten URL
app.delete('/api/urls', removeUrl) // Remove Shortened URL

app.get('/:shortId', handleRedirect) // Visit Short URL

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})