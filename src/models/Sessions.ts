import { Schema, model, Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'


interface Session {
    sessionId: string,
    userId: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    userIp?: string,
    userAgent?: string
}

const SessionSchema = new Schema<Session>({
    sessionId: {
        type: String,
        required: true,
        default: () => uuidv4(),
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => Date.now()
    },
    userIp: String,
    userAgent: String
})

const Session = model<Session>('Sessions', SessionSchema)

export default Session