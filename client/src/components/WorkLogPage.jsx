import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Clock, Briefcase, FileText, Timer } from 'lucide-react';
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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const todayEntries = data
            .filter(entry => dayjs(entry.date).isSame(currentDate, 'day'))
            .sort((a, b) => dayjs(`${a.date} ${a.startTime}`).diff(dayjs(`${b.date} ${b.startTime}`)));
          setEntries(todayEntries);
        } else {
          setEntries([]);
        }
      })
      .catch(() => setEntries([]));
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
    const s = dayjs(`${currentDate} ${start}`);
    const e = dayjs(`${currentDate} ${end}`);
    if (!s.isValid() || !e.isValid() || e.isBefore(s)) return null;
    const diff = e.diff(s, 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatTime = time => dayjs(`${currentDate} ${time}`).format('hh:mm A');

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${URL}/api/done/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEntries(entries.filter(entry => entry._id !== id));
        toast.success('Entry deleted');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting entry');
    }
  };

  // Calculate total duration
  const totalMinutes = entries.reduce((acc, entry) => {
    const parts = entry.duration.split(' ');
    return acc + (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 60px' }}>
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
            <FileText size={24} style={{ color: '#7c3aed' }} />
            Work Log
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {dayjs(currentDate).format('dddd, D MMMM YYYY')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          }}
        >
          <Plus size={18} /> Log Work
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px',
        marginBottom: '28px',
      }}>
        <div className="glass-card" style={{ padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Entries</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#00d4ff' }}>{entries.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Total Time</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>{totalHours}h {totalMins}m</div>
        </div>
        <div className="glass-card" style={{ padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Task Entries</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{entries.filter(e => e.workType === 'task').length}</div>
        </div>
      </div>

      {/* Add Work Form Modal */}
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
            width: '440px',
            maxWidth: '90vw',
            background: 'rgba(15, 31, 53, 0.92)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            borderRadius: '20px',
            padding: '32px',
            animation: 'scaleIn 0.3s ease-out',
            boxShadow: '0 0 60px rgba(124, 58, 237, 0.1)',
          }}>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{
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
              marginBottom: '6px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Log Work</h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '24px' }}>
              Date: {dayjs(currentDate).format('D MMMM YYYY')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Time inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="input-glass" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="input-glass" />
                </div>
              </div>

              {/* Work Type Toggle */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Work Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['task', 'other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWorkType(type)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: `1px solid ${workType === type ? (type === 'task' ? 'rgba(0, 212, 255, 0.4)' : 'rgba(124, 58, 237, 0.4)') : 'rgba(148, 163, 184, 0.15)'}`,
                        background: workType === type ? (type === 'task' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(124, 58, 237, 0.08)') : 'transparent',
                        color: workType === type ? (type === 'task' ? '#00d4ff' : '#7c3aed') : '#94a3b8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 250ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {type === 'task' ? <Briefcase size={14} /> : <FileText size={14} />}
                      {type === 'task' ? 'Task' : 'Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional fields */}
              {workType === 'task' ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Task ID</label>
                    <input type="text" placeholder="Enter task ID" value={taskId} onChange={e => setTaskId(e.target.value)} required className="input-glass" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Completion %</label>
                    <input type="number" placeholder="0-100" value={completion} onChange={e => setCompletion(e.target.value)} min={0} max={100} required className="input-glass" />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Work Details</label>
                  <textarea
                    placeholder="Describe what you worked on"
                    value={customDetails}
                    onChange={e => setCustomDetails(e.target.value)}
                    required
                    className="input-glass"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
              )}

              <button type="submit" className="btn-primary" style={{
                width: '100%', padding: '12px', marginTop: '4px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              }}>
                Save Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Work Log Entries */}
      {entries.length === 0 ? (
        <div className="glass-card" style={{
          padding: '60px 24px',
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <FileText size={48} style={{ color: '#1e4060', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
            No work logged today
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Click "Log Work" to record your first activity
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {entries.map((entry, idx) => (
            <div
              key={entry._id || idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                animation: `fadeInUp ${0.2 + idx * 0.08}s ease-out`,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <div>
                {/* Time row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: '#00d4ff' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {formatTime(entry.startTime)}
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>→</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: '#7c3aed' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {formatTime(entry.endTime)}
                    </span>
                  </div>
                  {/* Duration badge */}
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '50px',
                    background: 'rgba(0, 212, 255, 0.08)',
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    color: '#00d4ff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Timer size={10} /> {entry.duration}
                  </span>
                </div>

                {/* Work details with type badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: entry.workType === 'task' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                    color: entry.workType === 'task' ? '#00d4ff' : '#7c3aed',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {entry.workType}
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.workDetails}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(entry._id)}
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
                title="Delete entry"
              >
                <Trash2 size={16} color="#ef4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkLogPage;
