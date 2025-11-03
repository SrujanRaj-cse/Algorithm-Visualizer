import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Sorting',
  'Search',
  'Graph',
  'Dynamic Programming',
  'Recursion',
  'Binary Tree',
  'Other'
];

const languages = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'TypeScript',
  'Other'
];

export default function CodeSubmission() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/submissions/submit',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        code: '',
        language: '',
        category: '',
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white',
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '12px',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          }}>
            📝 Submit Code
          </div>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Share your algorithm implementation with the AlgoViz community. 
            Help others learn by contributing your code!
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Alert Messages */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee 0%, #fcc 100%)',
              color: '#c33',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '2px solid #f99',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '15px',
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: 'linear-gradient(135deg, #efe 0%, #cfc 100%)',
              color: '#2a7',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '2px solid #9f9',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span>Code submitted successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>
                📌 Title <span style={{ color: '#e33' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Optimized Quick Sort Implementation"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>
                📄 Description <span style={{ color: '#e33' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your algorithm does, its time complexity, use cases, etc."
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '120px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Category and Language Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}>
                  🗂️ Category <span style={{ color: '#e33' }}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    cursor: 'pointer',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}>
                  💻 Language <span style={{ color: '#e33' }}>*</span>
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    cursor: 'pointer',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code Editor */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>
                💾 Your Code <span style={{ color: '#e33' }}>*</span>
              </label>
              <div style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: '#f8f9fa',
              }}
              className="code-editor-wrapper"
              >
                <textarea
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="// Paste your algorithm implementation here...&#10;&#10;function myAlgorithm() {&#10;  // Your code&#10;}"
                  required
                  rows="18"
                  style={{
                    width: '100%',
                    padding: '18px',
                    border: 'none',
                    fontSize: '14px',
                    fontFamily: "'Courier New', 'Monaco', 'Consolas', monospace",
                    resize: 'vertical',
                    minHeight: '350px',
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    outline: 'none',
                    lineHeight: '1.6',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    const wrapper = e.target.closest('.code-editor-wrapper');
                    if (wrapper) {
                      wrapper.style.borderColor = '#667eea';
                      wrapper.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    const wrapper = e.target.closest('.code-editor-wrapper');
                    if (wrapper) {
                      wrapper.style.borderColor = '#e0e0e0';
                      wrapper.style.boxShadow = 'none';
                    }
                  }}
                />
              </div>
              <p style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '8px',
                marginLeft: '4px',
              }}>
                💡 Tip: Make sure your code is well-formatted and includes comments for better understanding
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading 
                    ? 'linear-gradient(135deg, #999 0%, #777 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 4px 15px rgba(102, 126, 234, 0.4)',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {loading ? '⏳ Submitting...' : '🚀 Submit Code'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '16px 32px',
                  background: 'white',
                  border: '2px solid #667eea',
                  color: '#667eea',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f5f7fa';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
        }}>
          <p>📋 Your submission will be reviewed by our admin team</p>
        </div>
      </div>
    </div>
  );
}
