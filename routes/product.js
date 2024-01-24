const express = require('express')
const router = express.Router()

// controller
const productController = require('../controllers/product')

// auth
const auth = require('../auth')
const {verify, verifyAdmin} = auth

// Add product
// verify, verifyAdmin deleted
router.post('/add-product', productController.addProduct)

// Retrive all products
router.get('/all', productController.getAllProduct)

// Retrieve all active products
router.get('/all-active', productController.allActiveProduct)

// Retrive single product
router.get('/:productId', productController.getSingleProduct)

// Update product information (ADMIN ONLY)
router.put('/:productId', verify, verifyAdmin, productController.updateProduct)

// Archiving Product (ADMIN ONLY)
// change , verify, verifyAdmin
router.put('/archive/:productId', productController.archiveProduct)

// Activating Product (ADMIN ONLY)
router.put('/activate/:productId', verify, verifyAdmin, productController.activateProduct)

module.exports = router