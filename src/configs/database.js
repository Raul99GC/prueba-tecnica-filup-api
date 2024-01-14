const mongoose = require('mongoose')

const MONGO_URI = process.env.DATABASE_URL

mongoose.connect(MONGO_URI)
  .then(() => { console.log('Connected') })
  .catch(err => console.log(err))
