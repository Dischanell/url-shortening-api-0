import { Schema, model, Model } from 'mongoose'
import { hash, compare } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'


interface User {
    email: string,
    password: string
}

interface UserMethods {
    validatePassword(password: string): Promise<boolean>
}

const temporaryUserEmail = () => {
    const uuid = uuidv4()
    return `${uuid}@tempora.ry`
}

type UserModel = Model<User, {}, UserMethods>

const UserSchema = new Schema<User, UserModel, UserMethods>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        default: () => temporaryUserEmail()
    },
    password: {
        type: String,
        required: true,
        default: () => uuidv4()
    }
})

UserSchema.pre('save', async function(next){
    const hashedPassword = await hash(this.password, 12)
    this.password = hashedPassword

    next()
})

UserSchema.method('validatePassword', async function (password: string): Promise<boolean> {
    const isValid = await compare(password, this.password)
    return isValid
})

const User = model<User, UserModel>('Users', UserSchema)

export default User