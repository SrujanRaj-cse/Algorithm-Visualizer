import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">AlgoViz</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/submit-code" className="text-sm hover:text-blue-300 transition">Submit Code</Link>
              {user.role === 'admin' && (
                <Link to="/admin/verification" className="text-sm hover:text-blue-300 transition">Admin Panel</Link>
              )}
              <div className="text-sm">Hi, {user.name}</div>
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-blue-300 transition">Login</Link>
              <Link to="/register" className="text-sm hover:text-blue-300 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
