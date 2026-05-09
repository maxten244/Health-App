import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSlider from '../components/MoodSlider';
import { useCrisis } from '../context/CrisisContext';
import { apiPost } from '../services/api';

const TAGS = ['sleep', 'exercise', 'social', 'work', 'weather', 'food', 'other'];

export default function Dashboard() {
  const [moodScore, setMoodScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showCrisisModal } = useCrisis();
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/moods', {
        moodScore,
        notes: notes.trim() || undefined,
        tags: tags.length ? tags : undefined,
      });
      if (data.showCrisisModal && data.resources) {
        showCrisisModal({ message: data.message, resources: data.resources });
        return;
      }
      navigate('/mood-history');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Mood Check-in</h1>
      <p className="text-muted">How are you feeling right now? Your entry is private.</p>

      <form onSubmit={handleSubmit} className="card">
        <fieldset>
          <legend className="visually-hidden">Mood and notes</legend>
          <div className="form-group">
            <span id="mood-label">Mood (1 = low, 10 = high)</span>
            <MoodSlider
              value={moodScore}
              onChange={setMoodScore}
              disabled={loading}
              ariaLabel="Mood score from 1 to 10"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dashboard-notes">Optional notes</label>
            <textarea
              id="dashboard-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to remember..."
              rows={3}
              maxLength={2000}
            />
          </div>
          <div className="form-group">
            <span id="tags-label">Tags (optional)</span>
            <div className="tag-chips" role="group" aria-labelledby="tags-label">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip ${tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={tags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </fieldset>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }} disabled={loading}>
          {loading ? 'Saving…' : 'Save mood'}
        </button>
      </form>
    </div>
  );
}
