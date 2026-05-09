import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="container">
          <h1>Mental Health Check-in</h1>
          <p className="lead">
            A private, accessible space to track your mood, connect with supportive community, and find resources. Your data stays yours.
          </p>
          <nav aria-label="Get started">
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
            <Link to="/login" className="btn btn-secondary">Log in</Link>
          </nav>
        </div>
      </header>
      <section className="landing-section" aria-labelledby="privacy-heading">
        <div className="container">
          <h2 id="privacy-heading">Privacy first</h2>
          <p>
            We don’t sell your data. Mood entries are only yours. Community posts are anonymous—we never link them to your account.
          </p>
        </div>
      </section>
      <section className="landing-section" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading">What you can do</h2>
          <ul>
            <li>Track mood and see trends over time</li>
            <li>Post and respond anonymously in the community</li>
            <li>Browse and save mental health resources</li>
            <li>Access crisis resources anytime</li>
          </ul>
        </div>
      </section>
      
    </div>
  );
}
