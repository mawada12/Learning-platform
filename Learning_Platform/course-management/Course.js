const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  duration: { value: Number, unit: String }, 
  category: String,
  rating: Number,
  capacity: Number,
  pendingStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],//dh m4 s7 3l4an al user fy database tanaya
  AddedBY: {
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
  },
  published:{
    type:Boolean,
    default:false
  },
  reviews: [String]
});

// Define the enrollStudent method
courseSchema.methods.enrollStudent = async function(studentId) {
  try {
    if (this.enrolledStudents.length >= this.capacity) {
      throw new Error('Course is already at capacity');
    }

    if (this.enrolledStudents.includes(studentId)) {
      throw new Error('Student is already enrolled in the course');
    }

    // Add the student to the enrolledStudents array
    this.enrolledStudents.push(studentId);
    
    // Save the updated course
    await this.save();
    
    return { message: 'Student enrolled successfully' };
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Course', courseSchema);
