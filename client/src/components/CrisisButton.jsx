import { Link } from 'react-router-dom';
import { useCrisis } from '../context/CrisisContext';
import { useEffect } from 'react';

export default function CrisisButton() {
  const { showCrisisModal, loadCrisisResources } = useCrisis();

  useEffect(() => {
    loadCrisisResources();
  }, [loadCrisisResources]);

  return (
    <div className="crisis-button-wrapper">
      <Link
        to="/crisis"
        className="crisis-button btn btn-crisis"
        aria-label="Crisis resources and support"
      >
        In crisis? Get help
      </Link>
    </div>
  );
}
