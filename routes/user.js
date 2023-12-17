const express = require('express')
const router = express.Router()

// controller
const userController = require('../controllers/user')

// auth
const auth = require('../auth')
const {verify, verifyAdmin} = auth


// register user
router.post('/register', userController.registerUser)

// route for login / authenticate user
router.post('/login', userController.loginUser)

// route for retrieving all users (ADMIN ONLY)
router.get('/all', verify, verifyAdmin, userController.getAllUsers)

// retrieve user details
router.get('/details', verify, userController.getUserDetails)

// Set user as admin (ADMIN ONLY)
router.post('/set-user-admin', verify, verifyAdmin, userController.setUserAdmin)

router.post('/change-password', verify, userController.changePassword)

module.exports = router