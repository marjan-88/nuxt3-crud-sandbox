import { Schema, model } from "mongoose";


export interface UserDocument extends Document {
     username: string;
     email: string;
     password: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true 
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

export const User = model<UserDocument>("User", UserSchema);