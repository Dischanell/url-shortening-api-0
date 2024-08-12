import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './database'
import { handleUserRegistration, handleUserLogin, handleTemporaryUserRegistration } from './controllers/userController'
import { shortenUrl, handleRedirect, getUrls } from './controllers/urlController'


dotenv.config()

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())

connectToDatabase()

app.post('/api/users', handleUserRegistration) // User registration
app.post('/api/users/temporary', handleTemporaryUserRegistration) // Temporary user registration

app.post('/api/sessions', handleUserLogin) // User login

app.post('/api/urls', shortenUrl) // Shorten URL
app.get('/api/urls', getUrls) // Get Shortened URLs

app.get('/:shortId', handleRedirect) // Visit Short URL

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})