const express = require('express')
const router = express.Router()

// controller
const productController = require('../controllers/product')

// auth
const auth = require('../auth')
const {verify, verifyAdmin} = auth

// Add product
router.post('/add-product', verify, verifyAdmin, productController.addProduct)

// Retrive all products
router.get('/all', productController.getAllProduct)

// Retrieve all active products
router.get('/all-active', productController.allActiveProduct)

// Retrive single product
router.get('/:productId', productController.getSingleProduct)

// Update product information (ADMIN ONLY)
router.put('/:productId', verify, verifyAdmin, productController.updateProduct)

// Archiving Product (ADMIN ONLY)
router.put('/archive/:productId', verify, verifyAdmin, productController.archiveProduct)

// Activating Product (ADMIN ONLY)
router.put('/activate/:productId', verify, verifyAdmin, productController.activateProduct)

module.exports = router