import {
  BadRequestException,
  InternalServerException,
} from '../../Common/Exceptions/error.exception.js';
import UserModel from '../../DB/models/user.model.js';
import { successResponse } from '../../Common/index.js';
import { ObjectId } from 'mongodb';

export const signUp = async (req, res) => {
  try {
    const { name, email, password, age, phone } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error('Email already exists');
    }
    const newUser = await UserModel.create({ name, email, password, age, phone });
    return successResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return successResponse(res, 200, 'User logged in successfully', user);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, email, age } = req.body;
    if (!id || !ObjectId.isValid(id)) {
      throw BadRequestException({ message: 'Id is required and must be a valid id' });
    }
    if (!name && !email && !age) {
      throw BadRequestException({ message: 'At least one field is required to update' });
    }
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const updatedObject = {};
    if (name) updatedObject.name = name;
    if (email) updatedObject.email = email;
    if (age) updatedObject.age = age;
    if (email) {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw BadRequestException({ message: 'Email already exists' });
      }
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: updatedObject, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );
    return successResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id)) {
      throw BadRequestException({ message: 'Id is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const user = await UserModel.findByIdAndDelete({ _id: id });
    return successResponse(res, 200, 'User deleted successfully', user);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id)) {
      throw BadRequestException({ message: 'Id is required and must be a valid id' });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw BadRequestException({ message: 'User not found' });
    }
    return successResponse(res, 200, 'User found successfully', user);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
