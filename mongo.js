const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Egaus:${password}@gaus-cluster.435ysu8.mongodb.net/noteApp?retryWrites=true&w=majority&appName=gaus-cluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'React is hard',
  important: false,
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Note.find({important:true}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })