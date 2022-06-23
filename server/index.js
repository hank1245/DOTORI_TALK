const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { errorHandler } = require('./middleware/errorMiddleware')
const app = express()
require('dotenv').config()
const socket = require('socket.io')

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

const io = socket(server,{
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
    global.chatSocket = socket
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on('send-msg',(data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-received', data.message)
            console.log(data.message)
        }
    })
})