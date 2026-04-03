import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import DifficultyBadge from './DifficultyBadge';
import './ProblemCard.css';

export default function ProblemCard({ problem, index }) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className="problem-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="problem-card-left">
        <div className="problem-card-number">
          {String(problem.id).padStart(2, '0')}
        </div>
        <div className="problem-card-info">
          <span className="problem-card-title">{problem.title}</span>
        </div>
      </div>
      <div className="problem-card-right">
        <DifficultyBadge difficulty={problem.difficulty} />
        <FiChevronRight className="problem-card-arrow" size={18} />
      </div>
    </Link>
  );
}
