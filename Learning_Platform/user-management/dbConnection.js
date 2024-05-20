const mongoose = require('mongoose');
function userMongo(dbname){
    mongoose.connect(`mongodb://127.0.0.1:27017/${dbname}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))
  };

  module.exports = userMongo