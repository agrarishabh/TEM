import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Trash } from 'lucide-react';
import dayjs from 'dayjs';

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const URL = import.meta.env.VITE_BASE_URL;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          toast.error(data.message || 'Unexpected response');
          setTasks([]);
        }
      })
      .catch(() => toast.error('Failed to fetch tasks'));
  }, [token]);

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, task_detail: taskDetail }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        setShowForm(false);
        setTaskId('');
        setTaskDetail('');
        toast.success('Task added');
      } else {
        const { message } = await res.json();
        toast.error(message || 'Failed to create task');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };
  const deleteTask = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
        toast.success('Task deleted');
      } else {
        const { message } = await res.json();
        toast.error(message || 'Delete failed');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-30">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Tasks : </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-700 rounded-md"
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="bg-gray-100 p-4 text-black rounded-md mb-4 relative"
        >
          {/* Close Icon */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-600 hover:text-red-500 text-xl font-bold"
              aria-label="Close form"
            >
              <X onClick={() => setShowForm(false)} className="cursor-pointer text-gray-600 hover:text-red-500" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Task ID"
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
            required
            className="w-full text-black mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Task Detail"
            value={taskDetail}
            onChange={e => setTaskDetail(e.target.value)}
            required
            className="w-full text-black mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
          >
            Save
          </button>
        </form>
      )}


      <table className="w-full bg-[#0B1418] shadow-md rounded overflow-hidden">
        <thead className="bg-[#132026]">
          <tr>
            <th className="px-4 py-3 text-left">Task ID</th>
            <th className="px-4 py-3 text-left">Time 🕒</th>
            <th className="px-4 py-3 text-left">Task Detail</th>
            <th className="px-4 py-3 text-left">Complete %</th>
            <th className="px-4 py-3 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {[...tasks].sort((a, b) => a.taskId.localeCompare(b.taskId)).map(task => (
            <tr key={task._id} className="border-t transition-all">
              {/* Task ID */}
              <td className="px-4 py-3 font-bold">{task.taskId}</td>

              {/* Time */}
              <td className="px-4 py-3 text-sm flex items-center gap-2">
                <span role="img" aria-label="clock">🕒</span>
                <div>
                  <div>{dayjs(task.time).format('hh:mm A')}</div>
                  <div className="text-gray-500 text-xs">{dayjs(task.time).format('DD/MM/YYYY')}</div>
                </div>
              </td>

              {/* Task Detail */}
              <td className="px-4 py-3 text-red-500">{task.task_detail}</td>

              {/* Completion % with meter */}
              <td className="px-4 py-3">
                <div className="w-full bg-gray-200 rounded h-3 relative">
                  <div
                    className="bg-green-500 h-3 rounded"
                    style={{ width: `${task.complete_percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center mt-1">{task.complete_percentage}%</div>
              </td>
              <td className="px-4 py-3 text-center">
                <Trash
                  size={18}
                  className="text-gray-400 hover:text-red-600 cursor-pointer mx-auto"
                  onClick={() => deleteTask(task._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
