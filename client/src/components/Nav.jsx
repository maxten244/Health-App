import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" aria-label="Mental Health Check-in home">
          Check-in
        </Link>

        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        {user ? (
          <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
            <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            <li><Link to="/mood-history" onClick={() => setMenuOpen(false)}>Mood History</Link></li>
            <li><Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link></li>
            <li><Link to="/crisis" onClick={() => setMenuOpen(false)}>Crisis</Link></li>
            <li><Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link></li>
          </ul>
        ) : (
          <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link></li>
            <li><Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign up</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
}