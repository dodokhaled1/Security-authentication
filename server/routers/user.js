const express = require("express")
const router = express.Router()
const userControllers = require('../controllers/userController')


router.get('/', userControllers.view)
router.post('/login', userControllers.login)
router.get('/login', userControllers.loginpage)
router.get('/register', userControllers.register)
router.post('/register', userControllers.addUser)


module.exports = router
