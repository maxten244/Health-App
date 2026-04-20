export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite" aria-label={label}>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
