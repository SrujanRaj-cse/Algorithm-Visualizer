import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-right-panel">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-divider">Use your email for registration:</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                className="auth-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                className="auth-input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                className="auth-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
            <button className="auth-submit-btn" type="submit">SIGN UP</button>
          </form>
        </div>

        <div className="auth-left-panel">
          <div className="auth-brand">
            <div className="auth-logo">AlgoViz</div>
          </div>
          <div className="auth-content">
            <h1 className="auth-title">Hello, Friend!</h1>
            <p className="auth-subtitle">
              Enter your personal details and start your journey with us
            </p>
          </div>
          <Link to="/login">
            <button className="auth-switch-btn" type="button">SIGN IN</button>
          </Link>
        </div>
      </div>

      <div className="auth-accent auth-accent-red"></div>
      <div className="auth-accent auth-accent-yellow"></div>
    </div>
  );
}
