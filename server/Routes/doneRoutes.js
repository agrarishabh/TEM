import express from 'express';
import Done from '../models/Done.js';
import Task from '../models/Task.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// GET all done entries for logged-in user
router.get('/', verifyUser, async (req, res) => {
    try {
        const entries = await Done.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new work entry
router.post('/', verifyUser, async (req, res) => {
    const { date, startTime, endTime, duration, workType, taskId, completion, customDetails } = req.body;

    try {
        let workDetails = '';

        if (workType === 'task') {
            const task = await Task.findOne({ taskId });
            if (!task) return res.status(404).json({ message: 'Task not found' });

            task.complete_percentage = completion;
            await task.save();

            workDetails = task.task_detail;
        } else {
            workDetails = customDetails;
        }

        const done = new Done({
            user: req.user.id,
            date,
            startTime,
            endTime,
            duration,
            workDetails,
            workType, // ✅ Add this line
        });

        await done.save();
        res.status(201).json(done);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// In your Express backend (server.js or routes file)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Done.findByIdAndDelete(id); // Or your model's method
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
});


export default router;
