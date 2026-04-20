import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ResourceDirectory() {
  const [resources, setResources] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [cost, setCost] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (cost) params.set('cost', cost);
    if (q.trim()) params.set('q', q.trim());
    apiGet(`/api/resources?${params}`)
      .then((data) => mounted && setResources(Array.isArray(data) ? data : []))
      .catch(() => mounted && setResources([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [type, cost, q]);

  useEffect(() => {
    apiGet('/api/resources/saved').then((data) => {
      const ids = new Set((data || []).map((r) => r._id));
      setSavedIds(ids);
    }).catch(() => setSavedIds(new Set()));
  }, []);

  const handleSave = async (resource) => {
    try {
      await apiPost(`/api/resources/${resource._id}/save`);
      setSavedIds((prev) => new Set([...prev, resource._id]));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Resource Directory</h1>
      <p className="text-muted">Find and save mental health resources. Crisis lines are on the Crisis page.</p>

      <div className="card filters">
        <label htmlFor="filter-type">Type</label>
        <select id="filter-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="hotline">Hotline</option>
          <option value="campus">Campus</option>
          <option value="therapy">Therapy</option>
          <option value="support_group">Support group</option>
          <option value="app">App</option>
          <option value="local">Local</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="filter-cost">Cost</label>
        <select id="filter-cost" value={cost} onChange={(e) => setCost(e.target.value)}>
          <option value="">All</option>
          <option value="free">Free</option>
          <option value="low">Low</option>
          <option value="sliding">Sliding</option>
          <option value="paid">Paid</option>
        </select>
        <label htmlFor="filter-q">Search</label>
        <input
          id="filter-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or description"
          aria-label="Search resources"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {resources.length === 0 ? (
            <p className="text-muted">No resources match your filters.</p>
          ) : (
            resources.map((r) => (
              <ResourceCard
                key={r._id}
                resource={r}
                onSave={handleSave}
                saved={savedIds.has(r._id)}
                showSave={!r.isCrisis}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}
