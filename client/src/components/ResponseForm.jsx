import { useState } from 'react';

export default function ResponseForm({ onSubmit, disabled, placeholder = 'Write a supportive response…' }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="response-form" aria-label="Add response">
      <label htmlFor="response-content" className="visually-hidden">
        Your response
      </label>
      <textarea
        id="response-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        maxLength={2000}
        aria-describedby="response-char-hint"
      />
      <p id="response-char-hint" className="char-count" aria-live="polite">
        {content.length} / 2000
      </p>
      <button type="submit" className="btn btn-primary" disabled={disabled || !content.trim()}>
        Send support
      </button>
    </form>
  );
}
