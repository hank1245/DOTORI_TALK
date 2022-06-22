const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, setAvatar, getAllUsers } = require('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/setAvatar/:id',setAvatar)
router.get('/me',protect, getMe)
router.get('/allusers/:id',getAllUsers)

module.exports = router