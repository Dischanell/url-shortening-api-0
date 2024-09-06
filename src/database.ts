import { connect } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connectToDatabase(){
    try {
        const dbConnectionString = process.env.MONGODB_URI

        if (!dbConnectionString) throw new Error('MONGODB_URI environment variable is not defined')

        await connect(dbConnectionString)
        console.log('Connected to MongoDB')
    } catch (e) {
        console.error('Error connecting to MongoDB: ', e)
    }
}