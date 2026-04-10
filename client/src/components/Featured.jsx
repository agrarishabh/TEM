import React from 'react';
import { Clock, CheckCircle, BarChart3, ListTodo, Sparkles, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

const Featured = () => {
  const features = [
    {
      icon: <ListTodo size={28} />,
      title: 'Smart Task Management',
      description: 'Create, organize, and track your tasks with unique IDs. Monitor completion percentage in real-time.',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
    },
    {
      icon: <Clock size={28} />,
      title: 'Time Tracking',
      description: 'Log your work hours with precise start and end times. Track how much time you invest in each task.',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Performance Analytics',
      description: 'Visualize your productivity with 7-day performance graphs. See daily time invested at a glance.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #00d4ff 100%)',
    },
    {
      icon: <Target size={28} />,
      title: 'Goal Completion',
      description: 'Track completion percentages for every task. See exactly how close you are to finishing each goal.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    },
  ];

  const steps = [
    { number: '01', title: 'Create Tasks', desc: 'Add tasks with a unique ID and description to start tracking.' },
    { number: '02', title: 'Log Your Work', desc: 'Record start/end times and link work to tasks or custom activities.' },
    { number: '03', title: 'Track Progress', desc: 'Update completion percentages as you make progress on tasks.' },
    { number: '04', title: 'Analyze Performance', desc: 'View 7-day analytics to understand your productivity patterns.' },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 24px 80px',
        backgroundImage: `url('/TEM_background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dark gradient overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.88) 0%, rgba(26, 26, 78, 0.82) 40%, rgba(15, 42, 68, 0.85) 70%, rgba(10, 22, 40, 0.92) 100%)',
          zIndex: 1,
        }} />

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
          animation: 'orbFloat1 15s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          animation: 'orbFloat2 18s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
          animation: 'orbFloat1 20s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '900px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeInUp 0.8s ease-out',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '50px',
            background: 'rgba(0, 212, 255, 0.06)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            marginBottom: '28px',
            fontSize: '0.8rem',
            color: '#00d4ff',
            fontWeight: 500,
          }}>
            <Sparkles size={14} />
            Personal Productivity Companion
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}>
            <span style={{ color: '#f1f5f9' }}>Track Every</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 4s linear infinite',
            }}>
              Moment
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#94a3b8',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Your personal productivity companion — effortlessly track daily activities,
            manage tasks, and monitor your progress. Build better habits with actionable insights.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '14px 36px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '14px 36px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            marginTop: '60px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '7-Day', label: 'Analytics' },
              { value: '100%', label: 'Free to Use' },
              { value: '24/7', label: 'Accessible' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features-section" style={{
        padding: '100px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '50px',
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            marginBottom: '16px',
            fontSize: '0.75rem',
            color: '#7c3aed',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            <Zap size={12} /> Features
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}>
            Everything You Need
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Powerful tools to help you stay productive and reach your goals
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card" style={{
              padding: '32px 24px',
              animation: `fadeInUp ${0.4 + idx * 0.15}s ease-out`,
              cursor: 'default',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: feature.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '20px',
                boxShadow: `0 8px 25px ${feature.gradient.includes('#00d4ff') ? 'rgba(0, 212, 255, 0.2)' : 'rgba(124, 58, 237, 0.2)'}`,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#f1f5f9',
                marginBottom: '10px',
              }}>{feature.title}</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                lineHeight: 1.6,
              }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{
        padding: '80px 24px 100px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '50px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '16px',
            fontSize: '0.75rem',
            color: '#10b981',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            <TrendingUp size={12} /> How It Works
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
          }}>
            Simple 4-Step Process
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card" style={{
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              animation: `fadeInUp ${0.3 + idx * 0.15}s ease-out`,
            }}>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                minWidth: '60px',
              }}>{step.number}</div>
              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: '4px',
                }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Featured;