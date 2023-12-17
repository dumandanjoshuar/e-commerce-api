require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// External Route
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const cartRoutes = require('./routes/cart')


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let db = mongoose.connection
db.once('open', () => console.log(`Now connected to Database`))


// Backend routes
app.use('/b2/users', userRoutes)
app.use('/b2/products', productRoutes)
app.use('/b2/orders', orderRoutes)
app.use('/b2/carts', cartRoutes)


// Server Gateway Response
if (require.main === module) {
  app.listen(process.env.PORT, () => {
    console.log(`API is now online on port ${process.env.PORT}`)
  })
}

module.exports = {app, mongoose}