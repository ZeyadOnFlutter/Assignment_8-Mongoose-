import mongoose, { Schema } from 'mongoose';

export const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required {VALUE}'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [60, 'Age must be at most 60'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
});
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
