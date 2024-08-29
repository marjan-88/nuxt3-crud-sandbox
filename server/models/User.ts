import { Schema, model, Types } from "mongoose";


export interface UserDocument extends Document {
    _id: Types.ObjectId;
     name: string;
     email: string;
     password: string;
}

const UserSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
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