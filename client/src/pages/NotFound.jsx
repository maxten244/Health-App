import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found" style={{
      textAlign: 'center',
      padding: '80px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '80px', margin: 0, color: '#667eea' }}>404</h1>
      <h2 style={{ marginTop: '0' }}>Page not found</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}