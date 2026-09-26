import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function SectionHeader({ eyebrow, title, subtitle, link, linkText = 'View all' }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {link && <Link className="text-link" to={link}>{linkText}<ArrowUpRight size={17} /></Link>}
    </div>
  );
}
