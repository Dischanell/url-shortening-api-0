import { Schema, model, Model } from 'mongoose'
import { hash, compare } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

interface User {
    email: string,
    password: string
}

interface UserMethods {
    isCorrectPassword(password: string): Promise<boolean>,
    updateUser(email: string, password: string): Promise<User>
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

UserSchema.method('isCorrectPassword', async function (password: string): Promise<boolean> {
    const isCorrectPassword = await compare(password, this.password)
    return isCorrectPassword
})

UserSchema.method('updateUser', async function (email: string, password: string): Promise<User> {
    const user = this

    user.email = email
    user.password = password
    await user.save()

    return user
})

const User = model<User, UserModel>('Users', UserSchema)

export default User