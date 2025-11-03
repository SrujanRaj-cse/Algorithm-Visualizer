import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ This handles actual login via backend API
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:8080/api/auth/signin', { email, password });
      
      console.log('Login response:', res.data);
      
      // Check if response has required data
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from server');
      }
      
      // Save token and user data
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Token saved to localStorage');
      }
      
      // Save user data in AuthContext
      if (res.data.user) {
        login(res.data.user);
        console.log('User data saved to AuthContext:', res.data.user);
        
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        throw new Error('No user data in response');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Panel (Unchanged) */}
        <div className="auth-left-panel">
          <div className="auth-brand">
            <div className="auth-logo">AlgoViz</div>
          </div>
          <div className="auth-content">
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">
              To keep connected with us please login with your personal info
            </p>
          </div>
          <Link to="/register">
            <button className="auth-switch-btn" type="button">SIGN UP</button>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="auth-right-panel">
          <h2 className="auth-form-title">Sign in to your account</h2>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* ✅ This form now actually sends data to backend */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                className="auth-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              className="auth-submit-btn" 
              type="submit" 
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>

      {/* Background accents (unchanged) */}
      <div className="auth-accent auth-accent-red"></div>
      <div className="auth-accent auth-accent-yellow"></div>
    </div>
  );
}
