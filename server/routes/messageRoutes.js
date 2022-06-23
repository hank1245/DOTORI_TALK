const express = require('express')
const router = express.Router()
const {addMessage, getAllMessage  } = require('../controllers/messagesControllers')
const {protect} = require('../middleware/authMiddleware')

router.post("/addmsg",addMessage)
router.post('/getmsg',getAllMessage)

module.exports = router