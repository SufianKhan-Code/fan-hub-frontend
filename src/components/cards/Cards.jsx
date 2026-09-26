import { CalendarDays, Clock3, Eye, MapPin, Play, Sparkles, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkButton } from '../common/Actions';

const fallbacks = {
  default: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
  person: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80'
};
const imgFallback = (e, type='default') => { if (!e.currentTarget.dataset.fallback) { e.currentTarget.dataset.fallback='1'; e.currentTarget.src=fallbacks[type]; } };

export function CategoryCard({ item }) {
  return <motion.div whileHover={{ y: -7 }} transition={{ duration: .2 }}><Link className="category-card" to={`/category/${item.slug}`} style={{'--accent': item.color}}><img src={item.bannerImage} alt="" onError={imgFallback}/><div className="category-overlay"><span className="category-icon"><Sparkles size={18}/></span><h3>{item.name}</h3><p>{item.tagline}</p><span>{item.stats?.contentCount || 0} stories · {item.stats?.characterCount || 0} characters</span></div></Link></motion.div>;
}

export function ContentCard({ item, compact=false }) {
  return <article className={`content-card ${compact ? 'compact' : ''}`}><Link className="card-media" to={`/content/${item._id || item.slug}`}><img src={item.thumbnailUrl || item.bannerUrl} alt={item.title} onError={imgFallback}/><span className="content-type">{item.type}</span>{item.isTrending && <span className="trending-pill">Trending</span>}</Link><div className="card-body"><div className="card-meta"><span>{item.category?.name || item.fandom}</span><span><Star size={14} fill="currentColor"/>{Number(item.ratingAverage || 0).toFixed(1)}</span></div><Link to={`/content/${item._id || item.slug}`}><h3>{item.title}</h3></Link><p>{item.description}</p><div className="card-footer"><span><Eye size={15}/>{item.viewCount || 0}</span><BookmarkButton targetType="content" item={item}/></div></div></article>;
}

export function CharacterCard({ item }) {
  return <article className="character-card"><Link to={`/characters/${item._id}`}><div className="character-media"><img src={item.imageUrl} alt={item.name} onError={(e)=>imgFallback(e,'person')}/><div className="character-glow" /></div><div className="character-info"><span>{item.fandom}</span><h3>{item.name}</h3><p>{item.role}</p></div></Link><BookmarkButton className="floating-bookmark" targetType="character" item={item}/></article>;
}

export function ArticleCard({ item }) {
  return <article className="article-card"><Link to={`/articles/${item._id || item.slug}`} className="card-media"><img src={item.coverImage} alt={item.title} onError={imgFallback}/>{item.isFeatured && <span className="featured-pill">Featured</span>}</Link><div className="card-body"><div className="card-meta"><span>{item.category?.name || item.fandom}</span><span><Clock3 size={14}/>{item.readTime}</span></div><Link to={`/articles/${item._id || item.slug}`}><h3>{item.title}</h3></Link><p>{item.summary}</p><div className="card-footer"><span>By {item.authorName}</span><BookmarkButton targetType="article" item={item}/></div></div></article>;
}

export function MediaCard({ item }) {
  return <article className="media-card"><div className="card-media"><img src={item.thumbnailUrl} alt={item.title} onError={imgFallback}/><span className="media-play"><Play size={20} fill="currentColor"/></span><span className="content-type">{item.type}</span></div><div className="card-body"><div className="card-meta"><span>{item.fandom}</span><span>{item.duration}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="card-footer"><span><Star size={14} fill="currentColor"/>{Number(item.ratingAverage || 0).toFixed(1)}</span><BookmarkButton targetType="media" item={item}/></div></div></article>;
}

export function MerchCard({ item }) {
  return <article className="merch-card"><Link className="card-media" to={`/merchandise/${item._id}`}><img src={item.imageUrl} alt={item.name} onError={imgFallback}/><span className="merch-tag"><Tag size={13}/>{item.tag}</span></Link><div className="card-body"><span className="mini-label">{item.fandom}</span><Link to={`/merchandise/${item._id}`}><h3>{item.name}</h3></Link><p>{item.description}</p><div className="card-footer"><span>{item.releaseDate}</span><BookmarkButton targetType="merchandise" item={item}/></div></div></article>;
}

export function ReleaseCard({ item }) {
  const date = item.releaseDate ? new Date(item.releaseDate) : null;
  return <article className="release-card"><img src={item.bannerImage} alt={item.title} onError={imgFallback}/><div className="release-overlay"><span className="release-type">{item.releaseType}</span>{date && <div className="release-date"><strong>{date.toLocaleDateString(undefined,{day:'2-digit'})}</strong><span>{date.toLocaleDateString(undefined,{month:'short',year:'numeric'})}</span></div>}<h3>{item.title}</h3><p>{item.fandom} · {item.platform}</p></div></article>;
}

export function EventCard({ item }) {
  const date = item.startDate ? new Date(item.startDate) : null;
  return <article className="event-card"><Link className="card-media" to={`/events/${item._id || item.slug}`}><img src={item.bannerImage} alt={item.title} onError={imgFallback}/><span className="event-type">{item.type}</span></Link><div className="card-body"><div className="event-date-row"><span><CalendarDays size={16}/>{date?.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span><span><MapPin size={16}/>{item.city}</span></div><Link to={`/events/${item._id || item.slug}`}><h3>{item.title}</h3></Link><p>{item.description}</p><div className="card-footer"><span>{item.venue}</span><BookmarkButton targetType="event" item={item}/></div></div></article>;
}
