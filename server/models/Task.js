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
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index: taskId is unique per user, not globally
taskSchema.index({ user: 1, taskId: 1 }, { unique: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
