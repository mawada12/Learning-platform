const express = require('express');
const router = express.Router();
const Course = require('./Course');
const axios = require('axios');

/////////////////////////////////////////////////////////

router.post('/create-course', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const userInfores = await axios.get('http://localhost:3005/api/users/user-info', {
      headers: {
        authorization: token
      }
    });

    const userInfo = userInfores.data;

    const course = await Course.create({
      ...req.body,
      AddedBY: {
        userId: userInfo.id,
        userData: userInfo
      }
    });
  
    res.json(course);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////////////////////////////////////////////////////////

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({published:true});
    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/approveCourse",async(req,res)=>{
  await Course.updateOne({_id:req.body.id},{published:true})
  res.json({message:"course approved!"})
})

router.get('/coursesFordmin', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////


router.get("/track",async(req,res)=>{
  const courses = await Course.find({},{_id:0,name:1,rating:1,enrolledStudents:1,reviews:1}).sort({rating:-1})
  const obj = JSON.parse(JSON.stringify(courses))

  obj.forEach((course)=>{
    course.enrolledStudents = course.enrolledStudents.length
    course.reviews = course.reviews.length
  })


  return res.status(200).json(obj)
})

/////////////////////////////////////////////////////////


// Edit a course
router.put('/edit-course/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////


// Remove a course
router.delete('/remove-course/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////


// Search courses by category and name, and sort
router.get('/search-courses', async (req, res) => {
  try {
    var { searchKey, sortBy } = req.query;
    let query = {};
    console.log(searchKey)
    query.published = true;
    if (searchKey == undefined) {
      searchKey = "";
    }

    let reqQuery = Course.find({published:true,$or:[{name:{ $regex: searchKey, $options: "i" }},{category:{ $regex: searchKey, $options: "i" }}]});   // http://localhost:3001/api/courses/search-courses?sortBy=sort
    if(sortBy == "sort"){
      reqQuery.sort({"rating":-1})
    }
    const courses = await reqQuery

    return res.json(courses);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////

// Function to request enroll a student to a course
router.post('/enroll-course/:id', async (req, res) => {
    const courseId = req.params.id;
    const token = req.body.studentId;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  axios.get('http://localhost:3005/api/users/user-info', {
    headers: {
      authorization: token
    }
  }).then(async (data)=>{
    // console.log(data.data.id)
    const course = await Course.findOne({_id:courseId,published:true});
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    course.pendingStudents.push(data.data.id);
    await course.save()
    return res.json({ message: 'Student enrolled successfully' });
   
  })
});

/////////////////////////////////////////////////////////


// Function for instructor to accept enrollment request from a student
router.put('/accept-enrollment/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;

    const course = await Course.findByIdAndUpdate(courseId,{$addToSet:{enrolledStudents:studentId}});
    studentId.forEach((student)=>{
      course.pendingStudents.pull(student);
    })
    await course.save()
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Enrollment request accepted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////


// Function for instructor to deny enrollment request from a student
router.put('/deny-enrollment/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;

  
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    studentId.forEach((student)=>{
      course.pendingStudents.pull(student)
    })
    await course.save()
    res.json({ message: 'Enrollment request denied successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/////////////////////////////////////////////////////////

router.delete("/cancel-enrollment/:id",async (req,res)=>{
  const courseId = req.params.id
  const {studentId} = req.body
  const course = await Course.updateOne({_id:courseId,published:true},{$pull:{enrolledStudents:studentId}})
  if(course.modifiedCount){
    return res.json({message:"Enrollment cancelled successfully"})
  }
  res.json({message:"Enrollment was not found!"})
})

/////////////////////////////////////////////////////////

// Function for a student to cancel an enrollment request
router.delete('/cancel-enrollment/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;
    const course = await Course.findByIdAndUpdate(courseId,{$pull:{pendingStudents:studentId}});
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Enrollment request canceled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/getCurrentAndPast/:id",async (req,res)=>{
  const token = req.params.id;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  axios.get('http://localhost:3005/api/users/user-info', {
    headers: {
      authorization: token
    }
  }).then(async (data)=>{
    const courses = await Course.find({enrolledStudents:data.data.id})
    if(!courses){
      return res.status(404).json("no courses found!")
    }
    return res.status(200).json({courses})
  })
})

///////////////////////////////////////
// Fetch notifications
// router.get('/notifications', async (req, res) => {
//   try {
//     const notifications = await Notification.find({});
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch notifications' });
//   }
// });

// Fetch courses for review
router.get('/coursesForReview', async (req, res) => {
  try {
    const courses = await Course.find({ published: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses for review' });
  }
});

// Submit review and rating
router.post('/review', async (req, res) => {
  try {
    const { courseId, text, rating } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.reviews.push( text );
    course.rating = rating ;
    await course.save();
    res.json({ message: 'Review submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});


module.exports = router;
