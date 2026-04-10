import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Trash2, Clock, CheckCircle, AlertCircle, ListTodo } from 'lucide-react';
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
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
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

  const getProgressColor = (pct) => {
    if (pct >= 80) return { gradient: 'linear-gradient(90deg, #10b981, #00d4ff)', glow: 'rgba(16, 185, 129, 0.3)' };
    if (pct >= 50) return { gradient: 'linear-gradient(90deg, #00d4ff, #7c3aed)', glow: 'rgba(0, 212, 255, 0.3)' };
    if (pct >= 25) return { gradient: 'linear-gradient(90deg, #f59e0b, #f97316)', glow: 'rgba(245, 158, 11, 0.3)' };
    return { gradient: 'linear-gradient(90deg, #ef4444, #f97316)', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const getStatusBadge = (pct) => {
    if (pct === 100) return { label: 'Completed', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', icon: <CheckCircle size={12} /> };
    if (pct >= 50) return { label: 'In Progress', bg: 'rgba(0, 212, 255, 0.12)', color: '#00d4ff', icon: <Clock size={12} /> };
    return { label: 'Started', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', icon: <AlertCircle size={12} /> };
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const numA = parseInt(a.taskId);
    const numB = parseInt(b.taskId);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.taskId.localeCompare(b.taskId);
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 20px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ListTodo size={24} style={{ color: '#00d4ff' }} />
            Your Tasks
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Add Task Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 150,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div onClick={() => setShowForm(false)} style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
          }} />
          <div style={{
            position: 'relative',
            width: '420px',
            maxWidth: '90vw',
            background: 'rgba(15, 31, 53, 0.92)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '20px',
            padding: '32px',
            animation: 'scaleIn 0.3s ease-out',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)',
          }}>
            <button onClick={() => setShowForm(false)} style={{
              position: 'absolute', top: '14px', right: '14px',
              background: 'rgba(148, 163, 184, 0.1)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <X size={16} color="#94a3b8" />
            </button>

            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>New Task</h2>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Task ID</label>
                <input
                  type="text"
                  placeholder="e.g., 1, 2, 3..."
                  value={taskId}
                  onChange={e => setTaskId(e.target.value)}
                  required
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Task Detail</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={taskDetail}
                  onChange={e => setTaskDetail(e.target.value)}
                  required
                  className="input-glass"
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '4px' }}>
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Cards */}
      {tasks.length === 0 ? (
        <div className="glass-card" style={{
          padding: '60px 24px',
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <ListTodo size={48} style={{ color: '#1e4060', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
            No tasks yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Click "Add Task" to create your first task
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sortedTasks.map((task, idx) => {
            const progress = getProgressColor(task.complete_percentage);
            const status = getStatusBadge(task.complete_percentage);
            return (
              <div
                key={task._id}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  animation: `fadeInUp ${0.2 + idx * 0.08}s ease-out`,
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                {/* Task ID badge */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1))',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#00d4ff',
                }}>
                  {task.taskId}
                </div>

                {/* Task info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f1f5f9',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{task.task_detail}</h3>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '50px',
                      background: status.bg,
                      color: status.color,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Clock size={12} style={{ color: '#64748b' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {dayjs(task.time).format('hh:mm A')} · {dayjs(task.time).format('DD MMM YYYY')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${task.complete_percentage}%`,
                        height: '100%',
                        borderRadius: '3px',
                        background: progress.gradient,
                        boxShadow: `0 0 10px ${progress.glow}`,
                        transition: 'width 0.8s ease',
                        animation: 'progressFill 1s ease-out',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      minWidth: '36px',
                      textAlign: 'right',
                    }}>
                      {task.complete_percentage}%
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 250ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)'; }}
                  title="Delete task"
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
