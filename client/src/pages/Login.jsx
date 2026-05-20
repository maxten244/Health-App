import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/login', { email, password });
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '560px', minWidth: '320px', margin: '0 auto', padding: '3rem 24px 0' }}>
      <Link to="/" className="auth-link" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Back</Link>
      <h1 className="page-title" id="login-heading">Login</h1>
      <form onSubmit={handleSubmit} className="card" aria-labelledby="login-heading">
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link" style={{ textDecoration: 'underline' }}>Sign up</Link>
      </p>
    </div>
  );
}