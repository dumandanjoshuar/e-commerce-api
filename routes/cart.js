const express = require('express')
const router = express.Router()

// Controller
const cartController = require('../controllers/cart')

// auth
const auth = require('../auth')
const {verify, verifyAdmin} = auth

// Add product to cart
router.post('/add', verify, cartController.addToCart)

// Update item quantity in cart
router.put('/update', verify, cartController.updateCartItem)

// Remove item from cart
router.delete('/remove/:productId', verify, cartController.removeCartItem)

// retrieve user's cart
router.get('/', verify, cartController.getUserCart)

module.exports = router