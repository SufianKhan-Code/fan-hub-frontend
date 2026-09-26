export default function Pagination({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null;
  const values = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return <div className="pagination" aria-label="Pagination"><button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>{values.map((p, i) => <span key={p}>{i > 0 && values[i - 1] !== p - 1 && <span className="page-gap">…</span>}<button className={p === page ? 'active' : ''} onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}>{p}</button></span>)}<button disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></div>;
}
