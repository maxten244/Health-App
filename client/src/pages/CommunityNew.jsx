import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../context/CrisisContext';
import { apiPost } from '../services/api';

export default function CommunityNew() {
  const [content, setContent] = useState('');
  const [categoryTags, setCategoryTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showCrisisModal } = useCrisis();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/posts', {
        content: content.trim(),
        categoryTags: categoryTags.trim() ? categoryTags.split(',').map((t) => t.trim()) : [],
      });
      if (data.showCrisisModal && data.resources) {
        showCrisisModal({ message: data.message, resources: data.resources });
        return;
      }
      if (data.post?.postId) {
        navigate(`/community/${data.post.postId}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">New anonymous post</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="post-content">What's on your mind?</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            maxLength={2000}
          />
        </div>
        <div className="form-group">
          <label htmlFor="post-tags">Tags (comma-separated, optional)</label>
          <input
            id="post-tags"
            type="text"
            value={categoryTags}
            onChange={(e) => setCategoryTags(e.target.value)}
            placeholder="e.g. anxiety, sleep"
          />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting…' : 'Post anonymously'}
        </button>
      </form>
    </div>
  );
}
