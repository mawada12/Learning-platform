const express = require('express');
const router = express.Router();
const User = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateToken = ({ id, email, role, signature = "sarahagfuisg1654685" } = {}) => {
  const payload = {
    id, email, role
  }
  const token = jwt.sign(payload, signature, { expiresIn: "7d" });
  return token
}
const verifyToken = ({ token, signature = "sarahagfuisg1654685" } = {}) => {
  const decoded = jwt.verify(token, signature);
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role
  };
}

router.post('/register', async (req, res) => {
  try {
    console.log(req.body)
    const ISEmailExist = await User.findOne({ email: req.body.email })
    if (ISEmailExist) {
      return res.status(404).json({ error: 'Email Already Exist!' });
    }
    const user = await User.create(req.body)
    res.status(201).json({ message: "SIGNUP SUCCESSFULLY", user })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the provided email exists
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    console.log(token)

    res.status(200).json({ message: "LOGIN SUCCESS!", token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/////////////////////

router.get('/user-info', async (req, res) => {

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decodedToken = verifyToken({ token });

    res.json(decodedToken);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/getStudents", async (req, res) => {
  const students = await User.find({ role: "Student" })
  res.json({ students })
})

router.get("/getInstructors", async (req, res) => {
  const students = await User.find({ role: "Instructor" })
  res.json({ students })
})


module.exports = router;
