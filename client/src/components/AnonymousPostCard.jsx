import { Link } from 'react-router-dom';

export default function AnonymousPostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="card post-card" aria-labelledby={`post-${post.postId}-title`}>
      <h3 id={`post-${post.postId}-title`} className="post-card-title">
        <Link to={`/community/${post.postId}`}>View post</Link>
      </h3>
      <p className="post-content">{post.content}</p>
      {post.categoryTags?.length > 0 && (
        <ul className="post-tags" aria-label="Categories">
          {post.categoryTags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      <time dateTime={post.createdAt} className="post-time">
        {date}
      </time>
    </article>
  );
}
