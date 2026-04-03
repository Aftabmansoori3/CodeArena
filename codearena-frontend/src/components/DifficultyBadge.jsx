import './DifficultyBadge.css';

export default function DifficultyBadge({ difficulty }) {
  const level = difficulty?.toLowerCase() || 'easy';
  return (
    <span className={`difficulty-badge ${level}`}>
      {difficulty}
    </span>
  );
}
