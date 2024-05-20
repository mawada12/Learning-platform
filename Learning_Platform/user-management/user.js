const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  affiliation: String,
  yearsOfExperience: Number,
  bio: String,
  role: { 
    type: String, 
    enum: ['Admin', 'Instructor', 'Student'] 
  }
});

module.exports = mongoose.model('User', userSchema);
