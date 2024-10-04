const mongoose= require("mongoose");


// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  });
  

const User = mongoose.model('users', UserSchema);

module.exports = {User};