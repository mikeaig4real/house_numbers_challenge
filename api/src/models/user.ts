import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '../../types';

export interface IUser extends Omit<UserType, 'id'>, Document {}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
