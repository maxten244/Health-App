import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <p>
          This app is not emergency services. If you or someone you know is in immediate danger, please call 988 (US) or your local emergency number.
        </p>
        <nav aria-label="Footer">
          <Link to="/crisis">Crisis resources</Link>
          <Link to="/resources">Resource directory</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <p className="footer-copy">&copy; Mental Health Check-in. Your data is private and secure.</p>
      </div>
    </footer>
  );
}
