const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  phone: {
    type: Number,
    required: true
  },

  nationalId: {
    type: Number,
    required: true
  },


  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  //[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?

  password: {
    type: String, 
    required: true
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;