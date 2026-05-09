import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPatch } from '../services/api';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [privacy, setPrivacy] = useState({
    anonymityInCommunity: true,
    dataSharingEnabled: false,
    visibility: 'private',
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.privacySettings) {
      setPrivacy((p) => ({ ...p, ...user.privacySettings }));
    }
  }, [user]);

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await apiPatch('/api/auth/me', { privacySettings: privacy });
      updateUser(data.user);
      setMessage('Settings saved.');
    } catch (err) {
      setMessage(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await apiPatch('/api/auth/me', { password });
      setPassword('');
      setMessage('Password updated.');
    } catch (err) {
      setMessage(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Settings</h1>

      <section className="card" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy & anonymity</h2>
        <form onSubmit={handleSavePrivacy}>
          <div className="form-group">
            <label>
              Keep community posts anonymous
              <input
                type="checkbox"
                checked={privacy.anonymityInCommunity}
                onChange={(e) => setPrivacy((p) => ({ ...p, anonymityInCommunity: e.target.checked }))}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Allow anonymized data for improving the app (optional)
              <input
                type="checkbox"
                checked={privacy.dataSharingEnabled}
                onChange={(e) => setPrivacy((p) => ({ ...p, dataSharingEnabled: e.target.checked }))}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="visibility">Data visibility</label>
            <select
              id="visibility"
              value={privacy.visibility}
              onChange={(e) => setPrivacy((p) => ({ ...p, visibility: e.target.value }))}
            >
              <option value="private">Private (only you)</option>
              <option value="self">Self only</option>
              <option value="trusted">Trusted (if enabled later)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Save privacy settings
          </button>
        </form>
      </section>

      <section className="card" aria-labelledby="password-heading">
        <h2 id="password-heading">Change password</h2>
        <form onSubmit={handlePassword}>
          <div className="form-group">
            <label htmlFor="new-password">New password (min 8 characters)</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={loading || !password}>
            Update password
          </button>
        </form>
      </section>

      {message && <p className={message.startsWith('Failed') ? 'error-message' : ''} role="status">{message}</p>}
    </div>
  );
}