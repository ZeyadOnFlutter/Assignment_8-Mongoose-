import mongoose, { Schema } from 'mongoose';

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v !== v.toUpperCase();
        },
        message: (props) => `${props.value} should not be in entirely in uppercase`,
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NotesModel = mongoose.model('Notes', notesSchema);
export default NotesModel;
