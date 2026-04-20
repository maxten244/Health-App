export default function MoodCard({ entry }) {
  const d = new Date(entry.createdAt);
  const dateStr = d.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="card mood-card" aria-label={`Mood ${entry.moodScore} on ${dateStr}`}>
      <div className="mood-card-header">
        <span className="mood-score-badge" aria-hidden="true">
          {entry.moodScore}
        </span>
        <time dateTime={entry.createdAt}>
          {dateStr} · {timeStr}
        </time>
      </div>
      {entry.notes && <p className="mood-notes">{entry.notes}</p>}
      {entry.tags?.length > 0 && (
        <ul className="mood-tags" aria-label="Tags">
          {entry.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
