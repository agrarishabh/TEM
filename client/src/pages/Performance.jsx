import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import { TrendingUp, Clock, CheckCircle, Zap, BarChart3, Award } from 'lucide-react';

const Performance = () => {
  const [data, setData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${URL}/api/performance`, {
      headers: { Authorization: `Bearer ${token}` },
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

  // Calculate stats
  const allEntries = data.flatMap(d => d.entries);
  const totalMinutes = allEntries.reduce((acc, e) => acc + e.durationMinutes, 0);
  const totalTaskMinutes = allEntries.filter(e => e.workType === 'task').reduce((acc, e) => acc + e.durationMinutes, 0);
  const avgMinutesPerDay = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;

  const maxMinutes = Math.max(...data.flatMap(d => d.entries.map(e => e.durationMinutes)), 60);
  const tickValues = Array.from({ length: Math.ceil(maxMinutes / 60) + 1 }, (_, i) => i * 60);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { durationMinutes, workDetails } = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(15, 31, 53, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}>{workDetails}</p>
          <p style={{ fontSize: '0.8rem', color: '#00d4ff' }}>Duration: {formatDuration(durationMinutes)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomSummaryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const minutes = payload[0].value;
      const rawDate = payload[0].payload.rawDate;
      return (
        <div style={{
          background: 'rgba(15, 31, 53, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}>
            {dayjs(rawDate).format('D MMM YYYY')}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#7c3aed' }}>Total: {formatDuration(minutes)}</p>
        </div>
      );
    }
    return null;
  };

  // Summary chart data
  const summaryData = data.map(day => {
    const totalTaskMins = day.entries
      .filter(entry => entry.workType === 'task')
      .reduce((acc, entry) => acc + entry.durationMinutes, 0);
    return {
      rawDate: day.date,
      dateLabel: dayjs(day.date).format('D MMM'),
      totalMinutes: totalTaskMins,
    };
  });
  const maxSummaryMinutes = Math.max(...summaryData.map(d => d.totalMinutes), 60);
  const summaryTicks = Array.from({ length: Math.ceil(maxSummaryMinutes / 60) + 1 }, (_, i) => i * 60);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeInUp 0.5s ease-out' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '50px',
          background: 'rgba(0, 212, 255, 0.06)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          marginBottom: '14px',
          fontSize: '0.75rem',
          color: '#00d4ff',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          <TrendingUp size={12} /> Analytics Dashboard
        </div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 800,
          color: '#f1f5f9',
        }}>
          Last 7 Days Performance
        </h1>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '40px',
        animation: 'fadeInUp 0.6s ease-out',
      }}>
        {[
          { icon: <Clock size={20} />, label: 'Total Time', value: formatDuration(totalMinutes), color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.08)' },
          { icon: <Zap size={20} />, label: 'Task Time', value: formatDuration(totalTaskMinutes), color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.08)' },
          { icon: <BarChart3 size={20} />, label: 'Avg / Day', value: formatDuration(avgMinutesPerDay), color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
          { icon: <CheckCircle size={20} />, label: 'Tasks Done', value: taskData.length.toString(), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card" style={{
            padding: '24px 20px',
            textAlign: 'center',
            animation: `fadeInUp ${0.4 + idx * 0.1}s ease-out`,
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: stat.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: stat.color, margin: '0 auto 12px',
            }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: stat.color,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Charts */}
      {data.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <BarChart3 size={18} style={{ color: '#00d4ff' }} />
            Daily Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.map((day, idx) => {
              const formattedEntries = day.entries.map(entry => ({
                ...entry,
                formattedStartTime: dayjs(`${day.date} ${entry.startTime}`).format('hh:mm A'),
              }));
              return (
                <div key={day.date} className="glass-card" style={{
                  padding: '24px',
                  animation: `fadeInUp ${0.3 + idx * 0.1}s ease-out`,
                }}>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    marginBottom: '16px',
                    textAlign: 'center',
                  }}>
                    {dayjs(day.date).format('dddd, D MMM')}
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={formattedEntries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" />
                      <XAxis dataKey="formattedStartTime" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }} />
                      <YAxis ticks={tickValues} tickFormatter={(min) => `${min / 60}hr`} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 212, 255, 0.04)' }} />
                      <defs>
                        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="durationMinutes" fill="url(#barGrad1)" activeBar={{ fill: '#00d4ff' }} barSize={28} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      <div className="glass-card" style={{
        padding: '28px',
        marginBottom: '40px',
        animation: 'fadeInUp 0.6s ease-out',
      }}>
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Award size={18} style={{ color: '#f59e0b' }} />
          Completed Tasks
        </h2>
        {taskData.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {taskData.map(task => (
              <span key={task._id} style={{
                padding: '8px 16px',
                borderRadius: '50px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <CheckCircle size={14} /> {task.task_detail || '(No details)'}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
            No completed tasks in the last 7 days
          </p>
        )}
      </div>

      {/* Summary Chart */}
      {summaryData.length > 0 && (
        <div className="glass-card" style={{
          padding: '28px',
          animation: 'fadeInUp 0.7s ease-out',
        }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={18} style={{ color: '#7c3aed' }} />
            Total Task Time per Day
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" />
              <XAxis dataKey="dateLabel" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }} />
              <YAxis
                domain={[0, maxSummaryMinutes]}
                ticks={summaryTicks}
                tickFormatter={(min) => `${min / 60}hr`}
                interval={0}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
              />
              <Tooltip content={<CustomSummaryTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.04)' }} />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="totalMinutes"
                fill="url(#barGrad2)"
                barSize={36}
                activeBar={{ fill: '#7c3aed' }}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Performance;
