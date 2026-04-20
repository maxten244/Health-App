import { createContext, useContext, useState, useCallback } from 'react';
import { apiGet } from '../services/api';

const CrisisContext = createContext(null);

export function CrisisProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [crisisResources, setCrisisResources] = useState([]);
  const [message, setMessage] = useState('');

  const loadCrisisResources = useCallback(async () => {
    try {
      const data = await apiGet('/api/crisis/resources');
      setCrisisResources(data.contacts || []);
      setMessage(data.disclaimer || '');
    } catch {
      setCrisisResources([]);
      setMessage('If you are in crisis, please call 988 (US) or your local emergency number.');
    }
  }, []);

  const showCrisisModal = useCallback((payload) => {
    if (payload?.resources?.length) setCrisisResources(payload.resources);
    if (payload?.message) setMessage(payload.message);
    setModalOpen(true);
  }, []);

  const closeCrisisModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <CrisisContext.Provider
      value={{
        modalOpen,
        crisisResources,
        message,
        showCrisisModal,
        closeCrisisModal,
        loadCrisisResources,
      }}
    >
      {children}
    </CrisisContext.Provider>
  );
}

export function useCrisis() {
  const ctx = useContext(CrisisContext);
  if (!ctx) throw new Error('useCrisis must be used within CrisisProvider');
  return ctx;
}
