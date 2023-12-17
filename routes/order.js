const express = require('express')
const router = express.Router()

// controller
const orderController = require('../controllers/order')

// auth
const auth = require('../auth')
const {verify, verifyAdmin} = auth

// checkout/create order
router.post('/checkout', verify, orderController.createOrder)

// Route for retrieving user's order
router.get('/user-orders', verify, orderController.getOrders)

// Route for retrieving all orders (ADMIN ONLY)
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrder)

module.exports = router
