const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User Id is required']
  },
  
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product Id is required']
    },
    
    quantity: {
      type: Number,
      required: [true, 'Quantity is required']
    },
    
    subTotal: {
      type: Number
    }
  }],
  
  totalAmount: {
    type: Number,
  },
  
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  
  purchasedOn: {
    type: Date,
    default: new Date()
  }
}

)

// Model export
module.exports = mongoose.model('Order', orderSchema)