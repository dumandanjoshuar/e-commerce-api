const bcrypt = require('bcrypt');
const auth = require('../auth');

// Models
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Add product to cart
module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Fetch the product details
    const product = await Product.findById(productId);
    
    if (req.user.isAdmin) {
      return res.status(404).json({ error: "Admin is not allowed to add to cart"})
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(404).json({ error: 'Product is not active as of the moment'})
    }

    // Create cart item
    const cartItem = {
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity,
      subTotal: parseFloat((product.price * quantity).toFixed(2)),
    };

    // Update or create user's cart
    let userCart = await Cart.findOne({ userId });

    // If no cart exists, create a new one
    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingCartItem = userCart.items.find(item => item.productId.equals(productId));

    if (existingCartItem) {
      // Update the quantity of the existing item
      existingCartItem.quantity += quantity;
    } else {
      // Add the product to the cart with the specified quantity
      userCart.items.push(cartItem);
    }

    // Recalculate the total amount
    userCart.totalAmount = userCart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Save the updated cart
    await userCart.save();
    
    console.log("Calculated Quantity:", quantity)

    res.status(200).json({ message: 'Product added to cart successfully', userCart });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update item quantity in cart
module.exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find the product
    const product = await Product.findById(productId);
    const price = product.price;

    // Check if the product is already in the cart
    const existingItem = cart.items.find(item => item.productId.equals(productId));

    if (existingItem) {
      // Update the quantity of the existing item
      existingItem.quantity = quantity;
    } else {
      // Add the product to the cart with the specified quantity
      cart.items.push({
        productId,
        quantity,
        price,
      });
    }

    // Recalculate the total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove item from cart
module.exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Find the product price and quantity before removing it
    const cart = await Cart.findOne(
      { userId },
      { items: { $elemMatch: { productId } } }
    );

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    const { price, quantity } = cart.items[0];

    // Remove the product from the user's cart and store the result
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
    
    // Update totalAmount by subtracting the product price multiplied by quantity
    const newTotalAmount = updatedCart.totalAmount - price * quantity;

    // Update the totalAmount in the user's cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { totalAmount: newTotalAmount } },
      { new: true }
    );

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get user's cart
module.exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Fetch the user's cart
    const userCart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: ['_id', 'name', 'quantity', 'price'],
    });

    if (!userCart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.status(200).json(userCart);
  } catch (error) {
    console.error('Error in getUserCart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};