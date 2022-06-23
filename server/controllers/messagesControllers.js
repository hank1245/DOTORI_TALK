const asyncHandler = require('express-async-handler')
const Messages = require('../models/messageModel')

const addMessage = asyncHandler ( async (req,res,next) => {
    try {
        const {from, to ,message} = req.body
        const data = await Messages.create({
            message: {text: message},
            users: [from,to],
            sender: from
        })
        if(data) return res.json({msg:'message added successfully'})
        return res.json({msg: 'Failed to add message to the database'})
    } catch(err) {
        next(err)
    }
})

const getAllMessage = asyncHandler ( async (req,res,next) => {
    try {
        const {from, to} = req.body
        const messages = await Messages.find({
            users: {
                $all: [from,to],
            },
        }).sort({updatedAt:1 })
        console.log(messages)
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        res.json(projectedMessages)
    }catch(err) {
        next(err)
    }
})

module.exports = { addMessage,getAllMessage}