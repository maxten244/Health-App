import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" aria-label="Mental Health Check-in home">
          Check-in
        </Link>
        {user ? (
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/mood-history">Mood History</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/crisis">Crisis</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li>
              <button type="button" className="btn btn-secondary" onClick={handleLogout} aria-label="Log out">
                Log out
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-links">
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/signup" className="btn btn-primary">Sign up</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
}
