import { useState, useEffect } from 'react';
import { apiFetch, apiGet } from '../services/api';
import MoodCard from '../components/MoodCard';
import MoodChart from '../components/MoodChart';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MoodHistory() {
  const [entries, setEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const [list, analyticsData] = await Promise.all([
        apiGet(`/api/moods?${params}`),
        apiGet('/api/moods/analytics'),
      ]);
      setEntries(list);
      setAnalytics(analyticsData);
    } catch (err) {
      setEntries([]);
      setAnalytics(null);
      setError(err.message || 'Failed to load mood history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [from, to]);

  const handleExportCsv = async () => {
    setExporting(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const res = await apiFetch(`/api/moods/export/csv?${params}`);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mood-history.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err.message || 'Failed to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '70vh' }}>
      <h1 className="page-title">Mood History</h1>

      <div className="card filters" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor="filter-from">From</label>
          <input
            id="filter-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="Filter from date"
          />
          <label htmlFor="filter-to">To</label>
          <input
            id="filter-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="Filter to date"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="btn btn-secondary" style={{ width: '120px', whiteSpace: 'nowrap' }} onClick={handleExportCsv} disabled={exporting}>
            { exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button type="button" className="btn btn-secondary" style={{ width: '120px', whiteSpace: 'nowrap' }} onClick={load} disabled={loading}>
          Refresh
          </button>
        </div>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {analytics && (
            <>
              <MoodChart data={analytics.weekly} title="Weekly trend" />
              {analytics.insights?.length > 0 && (
                <div className="card">
                  <h3>Insights</h3>
                  <ul>
                    {analytics.insights.map((i) => (
                      <li key={i.tag}>
                        When you tag &quot;{i.tag}&quot;, average mood: {i.averageMood}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <h2>Entries</h2>
          {entries.length === 0 ? (
            <p className="text-muted">No mood entries yet.</p>
          ) : (
            entries.map((entry) => <MoodCard key={entry._id} entry={entry} />)
          )}
        </>
      )}
    </div>
  );
}