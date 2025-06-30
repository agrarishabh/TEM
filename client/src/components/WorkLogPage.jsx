import React, { useEffect, useState } from 'react';
import { Plus, X, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const WorkLogPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [workType, setWorkType] = useState('task');
  const [taskId, setTaskId] = useState('');
  const [completion, setCompletion] = useState('');
  const [customDetails, setCustomDetails] = useState('');
  const URL = import.meta.env.VITE_BASE_URL;

  const currentDate = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${URL}/api/done`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const todayEntries = data
            .filter(entry => dayjs(entry.date).isSame(currentDate, 'day'))
            .sort((a, b) => {
              return dayjs(`${a.date} ${a.startTime}`).diff(dayjs(`${b.date} ${b.startTime}`));
            });

          setEntries(todayEntries);
        } else {
          console.error('Expected an array, got:', data);
          setEntries([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch entries:', err);
        setEntries([]);
      });
  }, [URL]);



  const handleSubmit = async e => {
    e.preventDefault();
    const duration = calculateDuration(startTime, endTime);
    if (!duration) return toast.error('Invalid time range');

    const payload = {
      date: new Date(),
      startTime,
      endTime,
      duration,
      workType,
      taskId,
      completion,
      customDetails,
    };

    const token = localStorage.getItem('token');

    const res = await fetch(`${URL}/api/done`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setEntries([data, ...entries]);
      toast.success('Work log added');
      setShowForm(false);
      resetForm();
    } else {
      toast.error(data.message || 'Error adding work log');
    }
  };

  const resetForm = () => {
    setStartTime('');
    setEndTime('');
    setWorkType('task');
    setTaskId('');
    setCompletion('');
    setCustomDetails('');
  };

  const calculateDuration = (start, end) => {
    const startTime = dayjs(`${currentDate} ${start}`);
    const endTime = dayjs(`${currentDate} ${end}`);
    if (!startTime.isValid() || !endTime.isValid() || endTime.isBefore(startTime)) return null;
    const diff = endTime.diff(startTime, 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatTime = time => dayjs(`${currentDate} ${time}`).format('hh:mm A');
  const formatDate = date => dayjs(date).format('DD/MM/YYYY');
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${URL}/api/done/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setEntries(entries.filter(entry => entry._id !== id));
        toast.success('Entry deleted');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting entry');
    }
  };


  return (
    <div className="max-w-5xl mx-auto mt-24 px-4">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-xl font-bold">{formatDate(currentDate)}</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
          <Plus size={20} /> Add Work
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 space-y-4 text-black relative">
          {/* ❌ Close Button */}
          <X
            onClick={() => setShowForm(false)}
            className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-600"
            size={20}
          />
          <p>Date: <strong>{currentDate}</strong></p>
          <div className="flex gap-4">
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="border p-2 rounded w-full" />
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="border p-2 rounded w-full" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" value="task" checked={workType === 'task'} onChange={() => setWorkType('task')} />
              Task
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="other" checked={workType === 'other'} onChange={() => setWorkType('other')} />
              Other
            </label>
          </div>

          {workType === 'task' ? (
            <>
              <input type="text" placeholder="Task ID" value={taskId} onChange={e => setTaskId(e.target.value)} required className="w-full border p-2 rounded" />
              <input type="number" placeholder="Completion %" value={completion} onChange={e => setCompletion(e.target.value)} min={0} max={100} required className="w-full border p-2 rounded" />
            </>
          ) : (
            <textarea placeholder="Work Details" value={customDetails} onChange={e => setCustomDetails(e.target.value)} required className="w-full border p-2 rounded" />
          )}

          <button type="submit" className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      )}

      <table className="w-full bg-[#0B1418] mb-10 shadow rounded">
        <thead className="bg-[#132026]">
          <tr className="text-center">
            <th className="px-4 py-2">Start Time 🕒</th>
            <th className="px-4 py-2">End Time 🕒</th>
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2">Work Details</th>
            <th className="px-4 py-3 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry._id || idx} className="border-t text-center">
              <td className="px-4 py-2">🕒 {formatTime(entry.startTime)}</td>
              <td className="px-4 py-2">🕒 {formatTime(entry.endTime)}</td>
              <td className="px-4 py-2">{entry.duration}</td>
              <td
                className={`px-4 py-2 ${entry.workType === 'task' ? 'text-red-500' : 'text-white'
                  }`}
              >
                {entry.workDetails}
              </td>

              {/* 🗑️ Delete Button */}
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default WorkLogPage;
