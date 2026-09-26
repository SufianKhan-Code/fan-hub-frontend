export function Spinner({ label = 'Loading' }) {
  return <div className="spinner-wrap" role="status" aria-live="polite"><span className="spinner" /><span>{label}</span></div>;
}

export function SkeletonGrid({ count = 6 }) {
  return <div className="card-grid">{Array.from({ length: count }).map((_, i) => <div className="skeleton-card" key={i}><div className="skeleton media" /><div className="skeleton line wide" /><div className="skeleton line" /><div className="skeleton line short" /></div>)}</div>;
}
