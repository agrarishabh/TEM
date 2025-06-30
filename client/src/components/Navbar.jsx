import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
    localStorage.removeItem('token'); // ✅ remove token as well
    setUser(null);
    toast.success('Logged out successfully');
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
        localStorage.setItem('token', data.token); // ✅ Store the token here
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
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="w-full fixed top-0 z-50">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-3 relative bg-transparent">
        {/* Logo + Tagline */}
        <Link to="/" onClick={() => scrollTo(0, 0)} className="flex flex-col  lg:mt-5 lg:ml-30 items-center">
          <img src="/Tem.png" alt="Logo" className="w-13 h-13" />
          <h1 className="text-xs font-bold mt-1 text-center">TRACK EVERY MOMENT</h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-lg font-semibold hover:text-red-500">Home</Link>
          <button
            onClick={() => requireLogin(`/tasks/${user?.username}`)}
            className="text-lg font-semibold hover:text-red-500"
          >
            Tasks
          </button>
          <button
            onClick={() => requireLogin(`/performance/${user?.username}`)}
            className="text-lg font-semibold hover:text-red-500"
          >
            Performance
          </button>
        </div>


        {/* Menu & Login Buttons */}
        <div className="flex items-center gap-4">
          {/* Show Menu button only on mobile */}
          <div className="md:hidden">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={24} className="text-white" />
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <img src="/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
              <span className="font-medium text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg text-base"
            >
              Login
            </button>
          )}
        </div>


        {/* Mobile Nav Sidebar */}
        {sidebarOpen && (
          <div className="absolute top-16 left-0 w-64 bg-gray-900 text-white p-4 rounded-br-xl z-40 shadow-md">
            <div className="flex justify-end mb-2">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="text-base hover:text-red-400"
              >
                Home
              </Link>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  requireLogin(`/tasks/${user?.username}`);
                }}
                className="text-base text-left hover:text-red-400"
              >
                Tasks
              </button>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  requireLogin(`/performance/${user?.username}`);
                }}
                className="text-base text-left hover:text-red-400"
              >
                Performance
              </button>
            </div>

          </div>
        )}

        {/* Right Login Sidebar */}
        {showLoginForm && (
          <div className="absolute top-16 right-0 w-60 md:w-72 bg-white text-black p-6 rounded-bl-xl z-40 shadow-md border border-gray-300">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowLoginForm(false)}>
                <X size={20} />
              </button>
            </div>
            <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
              <input
                name="username" // ✅ Add this
                type="text"
                placeholder="Username"
                required
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
              />
              <input
                name="password" // ✅ Add this
                type="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
              >
                Login
              </button>
            </form>

            <p className="text-sm text-center mt-3">
              Don’t have an account?{' '}
              <button
                className="text-red-500 hover:underline"
                onClick={() => {
                  setShowLoginForm(false);
                  setShowRegisterForm(true);
                }}
              >
                Create New Account
              </button>
            </p>
          </div>
        )}

        {/* Fullscreen Register Modal */}
        {showRegisterForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-80 relative">
              <button
                onClick={() => setShowRegisterForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4 text-center">Create Account</h2>
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                <input name="name" type="text" placeholder="Name" required className="..." />
                <input name="username" type="text" placeholder="Username" required className="..." />
                <input name="email" type="email" placeholder="Email" required className="..." />
                <input name="password" type="password" placeholder="Password" required className="..." />
                <button type="submit" className="...">Register</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
