import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProblemCard from '../components/ProblemCard';
import { FiSearch } from 'react-icons/fi';
import './Dashboard.css';

const DIFFICULTIES = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [search, difficulty, problems]);

  const loadProblems = async () => {
    try {
      const res = await API.get('/problems');
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let result = [...problems];

    if (difficulty !== 'ALL') {
      result = result.filter(p => p.difficulty === difficulty);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }

    setFiltered(result);
  };

  const countByDifficulty = (diff) =>
    problems.filter(p => p.difficulty === diff).length;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Coding Challenges</h1>
          <p className="dashboard-subtitle">
            Sharpen your skills with {problems.length} curated problems
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-label">Total Problems</div>
            <div className="stat-card-value">{problems.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Easy</div>
            <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {countByDifficulty('EASY')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Medium</div>
            <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {countByDifficulty('MEDIUM')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Hard</div>
            <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {countByDifficulty('HARD')}
            </div>
          </div>
        </div>

        <div className="dashboard-filters">
          <div className="dashboard-search-wrapper">
            <FiSearch className="dashboard-search-icon" size={16} />
            <input
              type="text"
              className="dashboard-search"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`filter-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d === 'ALL' ? 'All' : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner spinner-lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard-empty">
            No problems found. Try adjusting your filters.
          </div>
        ) : (
          <div className="dashboard-problems">
            {filtered.map((problem, index) => (
              <ProblemCard key={problem.id} problem={problem} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
