import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCode, FiGrid, FiClock, FiAward, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const links = [
    { to: '/dashboard', label: 'Problems', icon: <FiGrid /> },
    { to: '/history', label: 'History', icon: <FiClock /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <FiAward /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-icon"><FiCode /></div>
          <span className="navbar-logo">CodeArena</span>
        </Link>

        <div className="navbar-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="navbar-username">{user?.username}</span>
          <button className="navbar-logout" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: 4 }} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
