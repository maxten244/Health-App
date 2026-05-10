import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import ResponseForm from '../components/ResponseForm';
import { useCrisis } from '../context/CrisisContext';
import { apiGet, apiPost } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showCrisisModal } = useCrisis();
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    apiGet(`/api/posts/${postId}`)
      .then((data) => {
        if (mounted) {
          setPost(data.post);
          setResponses(data.responses || []);
        }
      })
      .catch(() => mounted && setPost(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [postId]);

  useEffect(() => {
    socketRef.current = io(API_URL, { path: '/socket.io', withCredentials: true });
    const socket = socketRef.current;
    socket.on('response:new', ({ postId: id }) => {
      if (id === postId) {
        apiGet(`/api/posts/${postId}`).then((data) => {
          setResponses(data.responses || []);
        });
      }
    });
    return () => {
      socket.off('response:new');
      socket.disconnect();
    };
  }, [postId]);

  const handleResponse = async (content) => {
    try {
      const data = await apiPost(`/api/posts/${postId}/responses`, { content });
      if (data.showCrisisModal && data.resources) {
        showCrisisModal({ message: data.message, resources: data.resources });
        return;
      }
      if (data.response) setResponses((prev) => [...prev, data.response]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return (
    <div className="container">
      <p>Post not found.</p>
      <Link to="/community" className="back-link">Back to community</Link>
    </div>
  );

  return (
    <div className="container">
      <Link to="/community" className="back-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to community
      </Link>
      <article className="card post-detail">
        <p className="post-content">{post.content}</p>
        {post.categoryTags?.length > 0 && (
          <ul className="post-tags">
            {post.categoryTags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <time dateTime={post.createdAt}>
          {new Date(post.createdAt).toLocaleString()}
        </time>
      </article>
      <section aria-labelledby="responses-heading">
        <h2 id="responses-heading">Responses</h2>
        <ResponseForm onSubmit={handleResponse} />
        {responses.map((r) => (
          <div key={r.id} className="card response-card">
            <p>{r.content}</p>
            <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</time>
          </div>
        ))}
      </section>
    </div>
  );
}