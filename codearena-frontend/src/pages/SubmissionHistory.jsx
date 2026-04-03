import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './SubmissionHistory.css';

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get('/submissions/history');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictClass = (verdict) => {
    if (verdict === 'ACCEPTED') return 'accepted';
    if (verdict === 'WRONG_ANSWER') return 'failed';
    return 'error';
  };

  const getVerdictLabel = (verdict) => {
    const labels = {
      ACCEPTED: 'Accepted',
      WRONG_ANSWER: 'Wrong Answer',
      COMPILATION_ERROR: 'CE',
      RUNTIME_ERROR: 'RE',
      TIME_LIMIT_EXCEEDED: 'TLE',
    };
    return labels[verdict] || verdict;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <h1 className="history-title">Submission History</h1>
          <p className="history-subtitle">Your past code submissions and results</p>
        </div>

        {loading ? (
          <div className="history-loading">
            <div className="spinner spinner-lg" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="history-empty">
            <p>No submissions yet. Start solving problems!</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Verdict</th>
                  <th>Passed</th>
                  <th>Time</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={sub.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {submissions.length - i}
                    </td>
                    <td>
                      <Link
                        to={`/problem/${sub.problemId}`}
                        className="history-problem-link"
                      >
                        {sub.problemTitle}
                      </Link>
                    </td>
                    <td>
                      <span className={`history-verdict ${getVerdictClass(sub.verdict)}`}>
                        {getVerdictLabel(sub.verdict)}
                      </span>
                    </td>
                    <td className="history-time">
                      {sub.passedCount}/{sub.totalCount}
                    </td>
                    <td className="history-time">
                      {sub.executionTimeMs || 0}ms
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {formatDate(sub.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
