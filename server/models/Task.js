import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: String,
    required: true,
    unique: true,
  },
  complete_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  task_detail: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true, // make false if optional
  },
}, {
  timestamps: true, // includes createdAt and updatedAt automatically
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
