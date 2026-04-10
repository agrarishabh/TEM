import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const navigate = useNavigate();

  const requireLogin = (path) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    navigate(path);
  };

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const URL = import.meta.env.VITE_BASE_URL;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    try {
      const response = await fetch(`${URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Login successful');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setShowLoginForm(false);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch(`${URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Account created successfully');
        setShowRegisterForm(false);
        setShowLoginForm(true);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', requiresAuth: false },
    { label: 'Tasks', path: () => `/tasks/${user?.username}`, requiresAuth: true },
    { label: 'Performance', path: () => `/performance/${user?.username}`, requiresAuth: true },
  ];

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10, 22, 40, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" onClick={() => scrollTo(0, 0)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          }}>
            <img src="/Tem.png" alt="TEM" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>TEM</h1>
            <p style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Track Every Moment</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.requiresAuth) {
                  requireLogin(typeof link.path === 'function' ? link.path() : link.path);
                } else {
                  navigate(typeof link.path === 'function' ? link.path() : link.path);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 250ms ease',
                position: 'relative',
              }}
              onMouseEnter={e => { e.target.style.color = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.06)'; }}
              onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.background = 'transparent'; }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            <Menu size={22} color="#94a3b8" />
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px 6px 6px',
                borderRadius: '50px',
                background: 'rgba(0, 212, 255, 0.06)',
                border: '1px solid rgba(0, 212, 255, 0.12)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#fff',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f1f5f9' }} className="hidden sm:inline">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 250ms ease',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="btn-primary"
              style={{ padding: '8px 24px', fontSize: '0.85rem' }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ===== MOBILE SIDEBAR ===== */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />
          {/* Sidebar panel */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '280px',
            height: '100%',
            background: 'rgba(15, 31, 53, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(0, 212, 255, 0.1)',
            padding: '24px',
            animation: 'slideInLeft 0.3s ease-out',
          }}>
            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="#94a3b8" />
              </button>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setSidebarOpen(false);
                    if (link.requiresAuth) {
                      requireLogin(typeof link.path === 'function' ? link.path() : link.path);
                    } else {
                      navigate(typeof link.path === 'function' ? link.path() : link.path);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontWeight: 500,
                    padding: '14px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 250ms ease',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(0, 212, 255, 0.06)'; e.target.style.color = '#00d4ff'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#f1f5f9'; }}
                >
                  {link.label}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGIN PANEL ===== */}
      {showLoginForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {/* Backdrop */}
          <div onClick={() => setShowLoginForm(false)} style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          }} />
          {/* Modal */}
          <div style={{
            position: 'relative',
            width: '380px',
            maxWidth: '90vw',
            background: 'rgba(15, 31, 53, 0.9)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '20px',
            padding: '36px',
            animation: 'scaleIn 0.3s ease-out',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)',
          }}>
            {/* Close */}
            <button onClick={() => setShowLoginForm(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(148, 163, 184, 0.1)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <X size={16} color="#94a3b8" />
            </button>

            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Welcome Back</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '28px' }}>
              Sign in to your account
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input name="username" type="text" placeholder="Username" required className="input-glass" />
              <input name="password" type="password" placeholder="Password" required className="input-glass" />
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '4px' }}>
                Sign In
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
              Don't have an account?{' '}
              <button
                onClick={() => { setShowLoginForm(false); setShowRegisterForm(true); }}
                style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ===== REGISTER MODAL ===== */}
      {showRegisterForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {/* Backdrop */}
          <div onClick={() => setShowRegisterForm(false)} style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          }} />
          {/* Modal */}
          <div style={{
            position: 'relative',
            width: '420px',
            maxWidth: '90vw',
            background: 'rgba(15, 31, 53, 0.9)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '20px',
            padding: '36px',
            animation: 'scaleIn 0.3s ease-out',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)',
          }}>
            {/* Close */}
            <button onClick={() => setShowRegisterForm(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(148, 163, 184, 0.1)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <X size={16} color="#94a3b8" />
            </button>

            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Create Account</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '28px' }}>
              Start tracking every moment
            </p>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input name="name" type="text" placeholder="Full Name" required className="input-glass" />
              <input name="username" type="text" placeholder="Username" required className="input-glass" />
              <input name="email" type="email" placeholder="Email" required className="input-glass" />
              <input name="password" type="password" placeholder="Password" required className="input-glass" />
              <button type="submit" className="btn-primary" style={{
                width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '4px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              }}>
                Create Account
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
              Already have an account?{' '}
              <button
                onClick={() => { setShowRegisterForm(false); setShowLoginForm(true); }}
                style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
