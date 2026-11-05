import {
  BadRequestException,
  InternalServerException,
} from '../../Common/Exceptions/error.exception.js';
import NotesModel from '../../DB/models/notes.model.js';
import { successResponse } from '../../Common/index.js';
import { ObjectId } from 'mongodb';
import UserModel from '../../DB/models/user.model.js';

export const createNote = async (req, res) => {
  try {
    const { userId } = req.query;
    const { title, content } = req.body;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const note = await NotesModel.create({ title, content, userId });
    return successResponse(res, 201, 'Note created successfully', note);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;
    if (!noteId || !ObjectId.isValid(noteId)) {
      throw BadRequestException({ message: 'noteId is required and must be a valid id' });
    }
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    if (!title && !content) {
      throw BadRequestException({ message: 'At least one field is required to update' });
    }
    const existingNote = await NotesModel.findById(noteId);
    if (!existingNote) {
      throw BadRequestException({ message: 'Note not found' });
    }
    if (existingNote.userId.toString() !== userId) {
      throw BadRequestException({ message: 'You are not authorized to update this note' });
    }
    const updatedObject = {};
    if (title) updatedObject.title = title;
    if (content) updatedObject.content = content;
    const updatedNote = await NotesModel.findByIdAndUpdate(
      noteId,
      { $set: updatedObject, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );
    return successResponse(res, 200, 'Note updated successfully', updatedNote);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;
    if (!noteId || !ObjectId.isValid(noteId)) {
      throw BadRequestException({ message: 'noteId is required and must be a valid id' });
    }
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const existingNote = await NotesModel.findById(noteId);
    if (!existingNote) {
      throw BadRequestException({ message: 'Note not found' });
    }
    if (existingNote.userId.toString() !== userId) {
      throw BadRequestException({ message: 'You are not authorized to replace this note' });
    }
    const replacedNote = await NotesModel.findOneAndReplace(
      { _id: noteId },
      { title, content, userId: existingNote.userId },
      { new: true, runValidators: true }
    );
    return successResponse(res, 200, 'Note replaced successfully', replacedNote);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const updateAllNote = async (req, res) => {
  try {
    const { userId } = req.query;
    const { title } = req.body;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    if (!title) {
      throw BadRequestException({ message: 'title is required to update' });
    }
    const existingNote = await NotesModel.findOne({ userId });
    if (!existingNote) {
      throw BadRequestException({ message: 'No Note Found' });
    }
    const updatedNote = await NotesModel.updateMany(
      { userId },
      { $set: { title }, $inc: { __v: 1 } },
      { runValidators: true }
    );
    return successResponse(res, 200, 'Notes updated successfully', updatedNote);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    if (!noteId || !ObjectId.isValid(noteId)) {
      throw BadRequestException({ message: 'noteId is required and must be a valid id' });
    }
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const existingNote = await NotesModel.findById(noteId);
    if (!existingNote) {
      throw BadRequestException({ message: 'Note not found' });
    }
    if (existingNote.userId.toString() !== userId) {
      throw BadRequestException({ message: 'You are not authorized to delete this note' });
    }
    const deletedNote = await NotesModel.findByIdAndDelete(noteId);
    return successResponse(res, 200, 'Note deleted successfully', deletedNote);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const deleteAllNotes = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const result = await NotesModel.deleteMany({ userId });
    return successResponse(res, 200, 'All notes deleted successfully', result);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const getPaginatedNotes = async (req, res) => {
  try {
    const { userId } = req.query;
    let { page = 1, limit = 10 } = req.query;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const notes = await NotesModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return successResponse(res, 200, 'Notes retrieved successfully', notes);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!id || !ObjectId.isValid(id)) {
      throw BadRequestException({ message: 'id is required and must be a valid id' });
    }
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const note = await NotesModel.findById(id);
    if (!note) {
      throw BadRequestException({ message: 'Note not found' });
    }
    if (note.userId.toString() !== userId) {
      throw BadRequestException({ message: 'You are not authorized to view this note' });
    }
    return successResponse(res, 200, 'Note retrieved successfully', note);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const getNoteByContent = async (req, res) => {
  try {
    const { userId, content } = req.query;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    if (!content) {
      throw BadRequestException({ message: 'content is required' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const note = await NotesModel.findOne({ userId, content: { $regex: content, $options: 'i' } });
    if (!note) {
      throw BadRequestException({ message: 'Note not found' });
    }
    return successResponse(res, 200, 'Note retrieved successfully', note);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const getAllNotesWithUserInfo = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }
    const allNotes = await NotesModel.find(
      { userId },
      { title: 1, userId: 1, createdAt: 1 }
    ).populate('userId', 'email -_id');
    return successResponse(res, 200, 'Notes retrieved successfully', allNotes);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};

export const getAllNotesWithAggregation = async (req, res) => {
  try {
    const { title, userId } = req.query;

    if (!userId || !ObjectId.isValid(userId)) {
      throw BadRequestException({ message: 'userId is required and must be a valid id' });
    }

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw BadRequestException({ message: 'User not found' });
    }

    const matchQuery = { userId: new ObjectId(userId) };
    if (title) {
      matchQuery.title = { $regex: title, $options: 'i' };
    }

    const allNotes = await NotesModel.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          title: 1,
          createdAt: 1,
          userId: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
        },
      },
    ]);

    return successResponse(res, 200, 'Notes retrieved successfully', allNotes);
  } catch (error) {
    if (error.cause) throw error;
    throw InternalServerException({ message: error.message });
  }
};
