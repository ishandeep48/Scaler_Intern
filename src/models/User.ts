import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    currentScore: number;
    currentStreak: number;
    maxStreak: number;
    currentDifficulty: number;
    momentum: number;
}


const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    currentScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    currentDifficulty: { type: Number, default: 1, min: 1, max: 10 },
    momentum: { type: Number, default: 0 },
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
