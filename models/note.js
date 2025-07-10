import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    maxLength: 200,
    required: true
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

//module.exports = Note;
export default Note;