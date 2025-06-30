import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRoutes from './Routes/userRoutes.js';
import taskRoutes from './Routes/taskRoutes.js'; 
import doneRoutes from './Routes/doneRoutes.js';
import performanceRoutes from './Routes/performanceRoutes.js';
import cron from 'node-cron';

const app = express()
const PORT = process.env.PORT || 3000;
await connectDB()
cron.schedule('0 0 * * *', async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Delete completed tasks older than 7 days
  await Task.deleteMany({
    complete_percentage: 100,
    time: { $lt: sevenDaysAgo }
  });

  // Delete work logs older than 7 days
  await Done.deleteMany({
    date: { $lt: sevenDaysAgo }
  });

  console.log('Old completed tasks and work logs deleted');
});
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/done', doneRoutes);
app.use('/api', performanceRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
