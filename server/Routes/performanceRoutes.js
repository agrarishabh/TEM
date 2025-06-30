import express from 'express';
import { verifyUser } from '../middleware/auth.js';
import Done from '../models/Done.js';
import Task from '../models/Task.js';
import dayjs from 'dayjs';

const router = express.Router();

router.get('/performance', verifyUser, async (req, res) => {
  const userId = req.user.id;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const workLogs = await Done.find({
    user: userId,
    date: { $gte: sevenDaysAgo }
  }).lean();

  const grouped = workLogs.reduce((acc, log) => {
    const date = dayjs(log.date).format('YYYY-MM-DD');
    const durationParts = log.duration.split(' ');
    const minutes = (parseInt(durationParts[0]) || 0) * 60 + (parseInt(durationParts[1]) || 0);

    if (!acc[date]) acc[date] = [];
    acc[date].push({ ...log, durationMinutes: minutes });
    return acc;
  }, {});

  const completedTasks = await Task.find({
  user: userId,
  complete_percentage: 100,
  time: { $gte: sevenDaysAgo }
}).lean();

  const groupedArray = Object.keys(grouped).map(date => ({
    date,
    entries: grouped[date],
  }));

  res.json({ workLogs: groupedArray, completedTasks });
});

export default router;
