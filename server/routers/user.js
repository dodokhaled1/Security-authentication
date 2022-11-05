const express = require("express")
const router = express.Router()
const userControllers = require('../controllers/userController')

router.get('/', userControllers.view)
router.post('/login', userControllers.login)
router.get('/auth/google', userControllers.googleAuth)
router.get('/auth/google/secrets', userControllers.authSecrets)
router.get('/login', userControllers.loginpage)
router.get('/secrets', userControllers.secrets)
router.get('/register', userControllers.register)
router.get('/logout', userControllers.logout)
router.post('/register', userControllers.addUser)
router.get('/submit', userControllers.getToSecret)
router.post('/submit', userControllers.submit)

module.exports = router
