import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminVerification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [reviewNotes, setReviewNotes] = useState({});
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = filter === 'all' 
        ? 'http://localhost:8080/api/submissions/all'
        : filter === 'pending'
        ? 'http://localhost:8080/api/submissions/pending'
        : 'http://localhost:8080/api/submissions/all';

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let filtered = response.data;
      if (filter === 'approved') {
        filtered = filtered.filter(s => s.status === 'approved');
      } else if (filter === 'rejected') {
        filtered = filtered.filter(s => s.status === 'rejected');
      }

      setSubmissions(filtered);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      alert('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId, status) => {
    try {
      setProcessing(submissionId);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/submissions/review/${submissionId}`,
        {
          status,
          reviewNotes: reviewNotes[submissionId] || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from reviewNotes
      const newNotes = { ...reviewNotes };
      delete newNotes[submissionId];
      setReviewNotes(newNotes);

      // Refresh submissions
      fetchSubmissions();
    } catch (err) {
      console.error('Error reviewing submission:', err);
      alert('Failed to review submission');
    } finally {
      setProcessing(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          Code Verification Dashboard
        </h1>
        <p style={{ color: '#666' }}>Review and verify code submissions from users</p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {['pending', 'approved', 'rejected', 'all'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: `2px solid ${filter === status ? '#667eea' : '#e0e0e0'}`,
              background: filter === status ? '#667eea' : 'white',
              color: filter === status ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'capitalize',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: '#f9fafb',
          borderRadius: '12px'
        }}>
          <p style={{ color: '#666' }}>No submissions found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {submissions.map((submission) => (
            <div
              key={submission._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: `2px solid ${getStatusColor(submission.status)}20`,
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'start',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px' 
                  }}>
                    {submission.title}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: getStatusColor(submission.status) + '20',
                      color: getStatusColor(submission.status),
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {submission.status}
                    </span>
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {submission.category}
                    </span>
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {submission.language}
                    </span>
                  </div>
                  <p style={{ color: '#666', marginBottom: '8px' }}>
                    By: {submission.submittedBy?.name || 'Unknown'} ({submission.submittedBy?.email || 'N/A'})
                  </p>
                  <p style={{ color: '#999', fontSize: '12px' }}>
                    Submitted: {formatDate(submission.submittedAt)}
                  </p>
                  {submission.reviewedAt && (
                    <p style={{ color: '#999', fontSize: '12px' }}>
                      Reviewed: {formatDate(submission.reviewedAt)}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Description:
                </h4>
                <p style={{ color: '#333', lineHeight: '1.6' }}>
                  {submission.description}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Code:
                </h4>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  border: '1px solid #e0e0e0',
                  maxHeight: '400px',
                }}>
                  <code>{submission.code}</code>
                </pre>
              </div>

              {submission.reviewNotes && (
                <div style={{ 
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: '3px solid #667eea'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    Review Notes:
                  </h4>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    {submission.reviewNotes}
                  </p>
                </div>
              )}

              {submission.status === 'pending' && (
                <div style={{ marginTop: '16px' }}>
                  <textarea
                    placeholder="Add review notes (optional)"
                    value={reviewNotes[submission._id] || ''}
                    onChange={(e) => setReviewNotes({
                      ...reviewNotes,
                      [submission._id]: e.target.value,
                    })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      marginBottom: '12px',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleReview(submission._id, 'approved')}
                      disabled={processing === submission._id}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        cursor: processing === submission._id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: processing === submission._id ? 0.6 : 1,
                      }}
                    >
                      {processing === submission._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReview(submission._id, 'rejected')}
                      disabled={processing === submission._id}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: processing === submission._id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: processing === submission._id ? 0.6 : 1,
                      }}
                    >
                      {processing === submission._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

