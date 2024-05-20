const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const courseRoutes = require('./courseRoutes'); 
var cors = require('cors')


const app = express();
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/microser_db2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/courses', courseRoutes);

// Start the server
 app.listen(PORT, () => {
  console.log(`Course Management Service is running on port ${PORT}`);
});