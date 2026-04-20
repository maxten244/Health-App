import { useEffect } from 'react';
import { useCrisis } from '../context/CrisisContext';

export default function CrisisModal() {
  const { modalOpen, crisisResources, message, closeCrisisModal } = useCrisis();

  useEffect(() => {
    if (!modalOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && closeCrisisModal();
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalOpen, closeCrisisModal]);

  if (!modalOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-modal-title"
      aria-describedby="crisis-modal-desc"
    >
      <div className="modal-content crisis-modal-content">
        <h2 id="crisis-modal-title">You're not alone</h2>
        <p id="crisis-modal-desc" className="crisis-disclaimer">
          {message || 'This app is not emergency services. If you are in immediate danger, please call 988 (US) or your local emergency number.'}
        </p>
        <ul className="crisis-list" aria-label="Crisis resources">
          {crisisResources.map((r, i) => (
            <li key={i}>
              <strong>{r.name}</strong>
              {r.phone && <span> — {r.phone}</span>}
              {r.description && <span> — {r.description}</span>}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary" onClick={closeCrisisModal} autoFocus>
          Close
        </button>
      </div>
    </div>
  );
}
