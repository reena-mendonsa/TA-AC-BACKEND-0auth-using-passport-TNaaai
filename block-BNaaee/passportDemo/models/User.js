var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);