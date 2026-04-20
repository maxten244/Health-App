import { Link } from 'react-router-dom';

export default function ResourceCard({ resource, onSave, saved, showSave = true }) {
  return (
    <article className="card resource-card" aria-labelledby={`resource-${resource._id}-name`}>
      <h3 id={`resource-${resource._id}-name`}>{resource.name}</h3>
      <p className="resource-type">{resource.type}</p>
      {resource.description && <p className="resource-desc">{resource.description}</p>}
      {resource.contactInfo && (
        <p className="resource-contact">
          <strong>Contact:</strong> {resource.contactInfo}
        </p>
      )}
      {resource.website && (
        <a href={resource.website} target="_blank" rel="noopener noreferrer" className="resource-link">
          Visit website
        </a>
      )}
      <div className="resource-meta">
        <span>{resource.cost}</span>
        <span>{resource.availability}</span>
        {resource.languages?.length > 0 && <span>{resource.languages.join(', ')}</span>}
      </div>
      {showSave && onSave && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onSave(resource)}
          aria-pressed={saved}
        >
          {saved ? 'Saved' : 'Save for later'}
        </button>
      )}
    </article>
  );
}
