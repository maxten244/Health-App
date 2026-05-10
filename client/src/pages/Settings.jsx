import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiPatch } from '../services/api';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [privacy, setPrivacy] = useState({
    anonymityInCommunity: true,
    dataSharingEnabled: false,
    visibility: 'private',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [privacyMessage, setPrivacyMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.privacySettings) {
      setPrivacy((p) => ({ ...p, ...user.privacySettings }));
    }
  }, [user]);

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrivacyMessage('');
    try {
      const data = await apiPatch('/api/auth/me', { privacySettings: privacy });
      updateUser(data.user);
      setPrivacyMessage('Settings saved.');
    } catch (err) {
      setPrivacyMessage(err.message || 'Failed to save');
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
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await apiPatch('/api/auth/me', { password });
      setPassword('');
      setConfirmPassword('');
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
        {privacyMessage && (
          <p className={privacyMessage.startsWith('Failed') ? 'error-message' : ''} role="status">
            {privacyMessage}
          </p>
        )}
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
        {message && (
          <p className={message.startsWith('Failed') || message.startsWith('Password') ? 'error-message' : ''} role="status">
            {message}
          </p>
        )}
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
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={loading || !password || !confirmPassword}>
            Update password
          </button>
        </form>
      </section>
    </div>
  );
}