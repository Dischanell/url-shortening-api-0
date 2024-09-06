import { Schema, model, Types } from 'mongoose'
import { nanoid } from 'nanoid'

interface Url {
    userId: Types.ObjectId,
    url: string,
    shortId: string,
    views: number
}

const UrlSchema = new Schema<Url>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    url: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
        default: () => nanoid(6)
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
})

const Url = model<Url>('Urls', UrlSchema)

export default Url