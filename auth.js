const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET


// Token creation
module.exports.createAccessToken = (user) => {
  try {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  }
  
  return jwt.sign(data, secret, {}) // {expiresIn: "1h"}
} catch (err) {
  res.send({error: err.message})
}
}

// Token Verification
module.exports.verify = (req, res, next) => {
  
  try {
  let token = req.headers.authorization
  
  if (typeof token === "undefined"){
    return res.send({auth: 'Failed. No Token'})
  } else {
    token = token.slice(7, token.length)
    jwt.verify(token, secret, (err, decodedToken) => {
      if(err) {
        return res.send({
          auth: 'Failed',
          message: err.message})
      } else {
        req.user = decodedToken
        next()
      }
    })
  }
} catch (err) {
  res.send({error: err.message})
}
}

// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  if(req.user.isAdmin){
    next()
  } else {
    return res.send({
      auth: "Failed",
      message: "Action Forbidden"
    })
  }
}