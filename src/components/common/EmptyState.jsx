import { Sparkles } from 'lucide-react';
export default function EmptyState({ title = 'Nothing here yet', text = 'Try changing the filters or explore another fandom.' }) {
  return <div className="empty-state"><span className="empty-icon"><Sparkles /></span><h3>{title}</h3><p>{text}</p></div>;
}
