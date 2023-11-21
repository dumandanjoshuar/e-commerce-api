const bcrypt = require('bcrypt')
const auth = require('../auth')


// Models
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')

// Checkout / create order
module.exports.createOrder = async (req, res) => {
  try {
    const { cartId } = req.body;
    
    if (req.user.isAdmin) {
      return res.send({ERROR: 'Admin is not allowed to create order'})
    }

    // Validate cartId
    if (!cartId) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Fetch the user's cart using the provided cartId
    const userCart = await Cart.findOne({ _id: cartId });

    // Check if the user has a cart and if there are items in the cart
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ error: 'User has no items in the cart' });
    }

    // Fetch prices for products from the database
    const productPrices = await Promise.all(
      userCart.items.map(async (item) => {
        const productDoc = await Product.findById(item.productId);
        return productDoc ? productDoc.price : 0;
      })
    );

    // Calculate total amount
    const totalAmount = userCart.items.reduce((acc, item, index) => {
      const productTotal = productPrices[index] * item.quantity;
      return isNaN(productTotal) ? acc : acc + productTotal;
    }, 0);

    // Debugging: Log totalAmount
    console.log('Total Amount:', totalAmount);

    // Create a new order if totalAmount is a valid number
    if (!isNaN(totalAmount)) {
      const newOrder = new Order({
        userId: userCart.userId,
        products: userCart.items, // Use the products from the user's cart
        totalAmount,
        status: 'Pending',
      });

      // Save the order
      await newOrder.save();

      // Delete the user's cart collection after creating the order
      await Cart.deleteOne({ userId: userCart.userId });

      // Update user and product documents...

      // Send success response
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } else {
      // Send a 400 Bad Request response if totalAmount is NaN
      res.status(400).json({ error: 'Invalid product quantity or price' });
    }
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Retrieving user's order
module.exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id
    
    if (req.user.isAdmin) {
      return res.send({ERROR: 'Admin cannot retrieve order'})
    }
    
    const userOrders = await Order.find({userId}).populate({
      path: 'products',
      populate: {
        path: 'productId',
        select: ['_id', 'name', 'description', 'price']
      }
    })
    .sort({ purchasedOn: -1 })
    
    res.status(200).json(userOrders)
  } catch (err) {
    res.status(500).json({ error: err.message})
  }
}

// Retrieving all orders (ADMIN ONLY)
module.exports.getAllOrder = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const allOrders = await Order.find().populate({
      path: 'products',
      populate: {
        path: 'productId',
        select: ['_id', 'name', 'description', 'price'],
      },
    }).sort({ purchasedOn: -1 });

    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};