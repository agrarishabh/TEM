import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const Performance = () => {
  const [data, setData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');
  const maxMinutes = Math.max(...data.flatMap(d => d.entries.map(e => e.durationMinutes)), 60); // default to 60
  const tickValues = Array.from({ length: Math.ceil(maxMinutes / 60) + 1 }, (_, i) => i * 60); // [0, 60, 120, ...]


  useEffect(() => {
    fetch(`${URL}/api/performance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(({ workLogs, completedTasks }) => {
        setData(workLogs);
        setTaskData(completedTasks);
      })
      .catch(err => console.error(err));
  }, []);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { durationMinutes, workDetails } = payload[0].payload;
      return (
        <div className="bg-white text-black p-2 shadow rounded text-sm border border-gray-300">
          <p><strong>Work:</strong> {workDetails}</p>
          <p><strong>Duration:</strong> {formatDuration(durationMinutes)}</p>
        </div>
      );
    }
    return null;
  };
  const CustomSummaryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const minutes = payload[0].value;
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;

      const rawDate = payload[0].payload.rawDate;
      const formattedDate = dayjs(rawDate).format('D MMM'); // ✅ "30th June"

      return (
        <div className="bg-white text-black px-3 py-2 rounded shadow border border-gray-300 text-sm w-fit">
          <p className="font-semibold">Date: <span className="font-bold">{formattedDate}</span></p>
          <p className="font-semibold">Total Time: <span className="font-bold">{`${h}h ${m}m`}</span></p>
        </div>
      );
    }
    return null;
  };

  // Prepare summary data
  const summaryData = data.map(day => {
    const totalTaskMinutes = day.entries
      .filter(entry => entry.workType === 'task') // ✅ Include only task entries
      .reduce((acc, entry) => acc + entry.durationMinutes, 0);

    const rawDate = day.date;
    return {
      rawDate,
      dateLabel: dayjs(day.date).format('D MMM'),
      totalMinutes: totalTaskMinutes
    };
  });
  const maxSummaryMinutes = Math.max(...summaryData.map(d => d.totalMinutes), 60); // default 60
  const summaryTicks = Array.from({ length: Math.ceil(maxSummaryMinutes / 60) + 1 }, (_, i) => i * 60);



  return (
    <div className="p-6 max-w-5xl mx-auto mt-30">
      <h1 className="text-2xl text-center  font-bold mb-6">Your Last 7 Days Performance :</h1>

      <div className=" bg-[#0B1418] space-y-8">
        {data.map((day) => {
          const formattedEntries = day.entries.map(entry => ({
            ...entry,
            formattedStartTime: dayjs(`${day.date} ${entry.startTime}`).format('hh:mm A'),
          }));

          return (
            <div key={day.date}>
              <h2 className="text-lg text-center pt-4 font-semibold mb-2">{dayjs(day.date).format('D MMM')}</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={formattedEntries}>
                  <XAxis dataKey="formattedStartTime" />
                  <YAxis ticks={tickValues} tickFormatter={(min) => `${min / 60}hr`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="durationMinutes" fill="#ccc" activeBar={{ fill: '#f87171' }} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0B1418] mt-10">
        <h2 className="text-lg text-center pt-4 font-semibold mb-2">Completed Tasks : </h2>
        {taskData.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-red-500 p-4">
            {taskData.map(task => (
              <li key={task._id}>{task.task_detail || '(No details)'}</li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-sm pb-2">No completed tasks found in the last 7 days.</p>
        )}
      </div>
      <div className="bg-[#0B1418] mt-12">
        <h2 className="text-lg text-center pt-4 font-semibold mb-2">Total Time Invested per Day</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={summaryData}>
            <XAxis dataKey="dateLabel" />
            <YAxis
              domain={[0, maxSummaryMinutes]}
              ticks={summaryTicks}
              tickFormatter={(min) => `${min / 60}hr`}
              interval={0}
            />
            <Tooltip content={<CustomSummaryTooltip />} cursor={{ fill: 'transparent' }} />

            <Bar
              dataKey="totalMinutes"
              fill="#ccc" // Tailwind's red-300
              barSize={40}
              activeBar={{ fill: '#f87171' }}// Keep it red on hover
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Performance;
