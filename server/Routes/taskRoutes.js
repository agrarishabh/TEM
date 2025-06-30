import express from 'express';
import Task from '../models/Task.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tasks - fetch tasks for logged-in user
router.get('/', verifyUser, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ time: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verifyUser, async (req, res) => {
    const { taskId, task_detail } = req.body;
    try {
        const task = new Task({
            user: req.user.id, // ✅ CORRECT: send ObjectId
            taskId,
            task_detail,
            time: new Date(),
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// DELETE a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;
