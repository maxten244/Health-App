import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="container">
          <h1>Mental Health Check-in</h1>
          <p className="lead">
            A private, accessible space to track your mood, connect with supportive community, and find resources. Your data stays yours.
          </p>
          {!user && (
          <nav aria-label="Get started">
          <Link to="/signup" className="btn btn-primary">Get started</Link>
          <Link to="/login" className="btn btn-secondary">Log in</Link>
          </nav>
          )}
        </div>
      </header>

      <section className="landing-features" aria-labelledby="features-heading">
        <div className="container">
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <span className="landing-feature-icon">📈</span>
              <h3>Track your mood</h3>
              <p>Log how you feel daily and see trends over time with visual charts.</p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-icon">🤝</span>
              <h3>Community support</h3>
              <p>Post and respond anonymously. No one can link posts back to your account.</p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-icon">📚</span>
              <h3>Resources</h3>
              <p>Browse and save mental health resources — hotlines, therapy, apps, and more.</p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-icon">🔒</span>
              <h3>Privacy first</h3>
              <p>We don't sell your data. Your mood entries are only ever visible to you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}