const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/blogApp');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
