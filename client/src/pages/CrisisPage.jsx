import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export default function CrisisPage() {
  const [contacts, setContacts] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/crisis/resources')
      .then((data) => {
        setContacts(data.contacts || []);
        setDisclaimer(data.disclaimer || '');
      })
      .catch(() => {
        setDisclaimer('If you are in crisis, please call 988 (US) or your local emergency number. This app is not emergency services.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <h1 className="page-title">Crisis Resources</h1>
      <div className="card crisis-disclaimer-box" role="alert">
        <p><strong>This app is not emergency services.</strong></p>
        <p>{disclaimer || 'If you or someone you know is in immediate danger, please call 911 (US) or your local emergency number, or contact a crisis line below.'}</p>
      </div>

      {loading ? (
        <p>Loading resources…</p>
      ) : (
        <ul className="crisis-page-list">
          {contacts.map((c, i) => (
            <li key={i} className="card">
              <strong>{c.name}</strong>
              {c.phone && <p>Phone: {c.phone}</p>}
              {c.description && <p>{c.description}</p>}
              {c.availability && <p>Availability: {c.availability}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
