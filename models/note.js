import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', false)

//const password = process.argv[3]
const url = process.env.MONGODB_URI
//const url = `mongodb+srv://Egaus:${password}@gaus-cluster.435ysu8.mongodb.net/noteApp?retryWrites=true&w=majority&appName=gaus-cluster`

console.log('connecting to MongoDB...')
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note