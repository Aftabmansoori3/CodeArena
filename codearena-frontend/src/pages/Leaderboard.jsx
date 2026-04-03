import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiAward } from 'react-icons/fi';
import './Leaderboard.css';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await API.get('/leaderboard');
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-default';
  };

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">
            <FiAward style={{ marginRight: 10, verticalAlign: 'middle' }} />
            Leaderboard
          </h1>
          <p className="leaderboard-subtitle">Top coders ranked by problems solved</p>
        </div>

        {loading ? (
          <div className="leaderboard-loading">
            <div className="spinner spinner-lg" />
          </div>
        ) : entries.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No entries yet. Be the first to solve a problem!</p>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Rank</th>
                  <th>User</th>
                  <th style={{ width: 150, textAlign: 'center' }}>Problems Solved</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.userId}>
                    <td>
                      <span className={`leaderboard-rank ${getRankClass(entry.rank)}`}>
                        {entry.rank}
                      </span>
                    </td>
                    <td>
                      <div className="leaderboard-user">
                        <div className="leaderboard-avatar">
                          {entry.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="leaderboard-username">{entry.username}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="leaderboard-solved">{entry.problemsSolved}</span>
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
