import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import AnonymousPostCard from '../components/AnonymousPostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiGet } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      try {
        const data = await apiGet(`/api/posts?page=${page}&limit=20`);
        if (mounted) {
          setPosts(data.posts);
          setTotal(data.total);
        }
      } catch {
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => { mounted = false; };
  }, [page]);

  useEffect(() => {
    socketRef.current = io(API_URL, { path: '/socket.io', withCredentials: true });
    const socket = socketRef.current;
    socket.on('post:new', () => {
      setPosts((prev) => [...prev]);
      apiGet(`/api/posts?page=1&limit=20`).then((data) => {
        setPosts(data.posts);
        setTotal(data.total);
      });
    });
    return () => {
      socket.off('post:new');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container" style={{ minHeight: '70vh' }}>
      <h1 className="page-title">Community Support</h1>
      <p className="text-muted">
      Share anonymously and offer support. Posts are not linked to your account.
      </p>
      <Link to="/community/new" className="btn btn-primary" style={{ marginBottom: '1.5rem', display: 'inline-flex', textDecoration: 'none' }}>New post</Link>      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet. Be the first to share.</p>
          ) : (
            <>
              {posts.map((post) => (
                <AnonymousPostCard key={post.postId} post={post} />
              ))}
              {total > 20 && (
                <nav aria-label="Pagination">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {page}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={page * 20 >= total}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
