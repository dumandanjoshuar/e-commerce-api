const bcrypt = require('bcrypt')
const auth = require('../auth')

// Models
const User = require('../models/User')



// Register user
module.exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists, please use a different email' });
    }

    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      mobileNo: req.body.mobileNo,
      orderedProduct: [],
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
module.exports.loginUser = (req, res) => {
  
  return User.findOne({email: req.body.email})
  .then(result => {
    
    if (result === null){
      return res.send({error: 'incorrect password or email'})
    } else {
      const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
      
      if (isPasswordCorrect){
        return res.send({access: auth.createAccessToken(result), message: 'Login successful'})
      } else {
        return res.send({error: 'incorrect password or email'})
      }
    }
  })
  .catch(err => res.send({message: err.message}))
}

// Retrieve user details
module.exports.getUserDetails = async (req, res) => {
  try {
    const data = await User.findById(req.user.id);
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find({}); // Use await to wait for the promise to resolve
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Set user as admin (ADMIN ONLY)
module.exports.setUserAdmin = async (req, res) => {
  try {    
    
    const user = await User.findById(req.body.userId)
    
    if(!user){
      return res.status(404).json({ error: 'User not found' })
    }
    
    user.isAdmin = true
    
    await user.save()
    
    res.status(200).json({ message: 'User updated as admin successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Changing password

module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Fetch the user from the database
    const user = await User.findById(userId);

    // Check if the current password is correct
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};