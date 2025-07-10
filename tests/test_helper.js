import User from '../models/user.js'
import { connectToDatabase } from '../utils/db.js'

// ...

const usersInDb = async () => {
  await connectToDatabase()
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

export default {
  usersInDb,
}