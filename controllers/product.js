const bcrypt = require('bcrypt')
const auth = require('../auth')

// Models
const Product = require('../models/Product')


// Add product as an admin
module.exports.addProduct = async (req, res) => {
  try {
    
  // if (!req.user.isAdmin){
  //   return res.status(403).json({ error: 'Unauthorized: Only admins can add products.' })
    
  // } else {
    
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      
    })
    await newProduct.save()
    res.status(201).json(newProduct)
  // }
} catch (error) {
  res.status(500).json({ error: 'Failed to add the product.', details: error.message });
}
}


// Retrieve all products
module.exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({})
    
    res.send(products)
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// Retrieve all active product
module.exports.allActiveProduct = async (req, res) => {
  try {
    
    const activeProduct = await Product.find({ isActive: true})
    
    res.send(activeProduct)
    
  } catch (err) {
    res.status(500).json({ error: err.message})
  }
}


// Retrieve single product
module.exports.getSingleProduct = async (req, res) => {
  
  try {
    
    const singleProduct = await Product.findById(req.params.productId)
    
    res.send(singleProduct)
    
  } catch (err) {
    res.status(500).json({ error: err.message})
  }
  
}

// Updating a product information
module.exports.updateProduct = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      };

      const updatedProductResult = await Product.findByIdAndUpdate(req.params.productId, updatedProduct, {
        new: true
      });

      if (updatedProductResult) {
        res.send(true);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } else {
      res.status(403).json({ error: 'Unauthorized: Only admins can update products.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Archiving a product
module.exports.archiveProduct = async (req, res) => {
  try {
    const archivedProduct = {
      isActive: false
    };

    const updatedProductResult = await Product.findByIdAndUpdate(req.params.productId, archivedProduct, {
      new: true
    });

    if (updatedProductResult) {
      res.status(200).json(updatedProductResult);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Activating a product
module.exports.activateProduct = async (req, res) => {
  try {
    const activatedProduct = {
      isActive: true,
    };

    const updatedProductResult = await Product.findByIdAndUpdate(req.params.productId, activatedProduct, {
      new: true,
    });

    if (updatedProductResult) {
      res.status(200).json(updatedProductResult);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};