const mongoose = require("mongoose");

// Task Schema
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    comments: [{ 
      username: { type: String, ref: 'users' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
  });
  
  const Task = mongoose.model('task', TaskSchema);
  
  module.exports = {Task}