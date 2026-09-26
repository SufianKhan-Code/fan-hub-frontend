import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" aria-label="Home"><Home size={15} /> Home</Link>
      {items.map((item, index) => <span className="breadcrumb-segment" key={`${item.label}-${index}`}><ChevronRight size={14} />{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}
    </nav>
  );
}
