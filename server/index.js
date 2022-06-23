const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { errorHandler } = require('./middleware/errorMiddleware')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/messages',require('./routes/messageRoutes'))

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB Connection Success')
})
.catch((err) => {
    console.log(err.message)
})
app.use(errorHandler)

const server = app.listen(process.env.PORT, () => console.log('connection success'))
