import { Bookmark, BookmarkCheck, Share2, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function BookmarkButton({ targetType, item, className = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user || !item?._id) return;
    api.get('/bookmarks/check', { params: { targetType, targetId: item._id } }).then(({ data }) => setActive(data.isBookmarked)).catch(() => {});
  }, [user, targetType, item?._id]);
  const toggle = async () => {
    if (!user) { navigate('/login'); return; }
    setBusy(true);
    try {
      const title = item.title || item.name;
      const imageUrl = item.thumbnailUrl || item.coverImage || item.imageUrl || item.bannerImage || item.bannerUrl || '';
      const categoryName = item.category?.name || '';
      const linkMap = { content: `/content/${item._id}`, article: `/articles/${item._id}`, character: `/characters/${item._id}`, media: '/media', merchandise: `/merchandise/${item._id}`, event: `/events/${item._id}` };
      const { data } = await api.post('/bookmarks/toggle', { targetType, targetId: item._id, title, imageUrl, fandom: item.fandom || '', categoryName, linkUrl: linkMap[targetType] || '/' });
      setActive(Boolean(data.isBookmarked));
    } finally { setBusy(false); }
  };
  return <button className={`icon-button ${active ? 'active' : ''} ${className}`} onClick={toggle} disabled={busy} aria-label={active ? 'Remove bookmark' : 'Add bookmark'}>{active ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button>;
}

export function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1300); }
    } catch { /* user cancelled */ }
  };
  return <button className="icon-button" onClick={share} aria-label="Share"><Share2 size={18} />{copied && <span className="tiny-tooltip">Copied</span>}</button>;
}

export function RatingControl({ targetType, targetId, initialAverage = 0, initialCount = 0, showThumbs = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [average, setAverage] = useState(initialAverage || 0);
  const [count, setCount] = useState(initialCount || 0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!user || !targetId) return;
    api.get(`/ratings/${targetType}/${targetId}`).then(({ data }) => setScore(data.data?.score || 0)).catch(() => {});
  }, [user, targetId, targetType]);
  const rate = async (nextScore, thumb = 'none') => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post('/ratings', { targetType, targetId, score: nextScore || score || 5, thumb });
      setScore(data.data.userRating.score);
      setAverage(data.data.ratingAverage);
      setCount(data.data.ratingCount);
      setMessage('Saved');
      setTimeout(() => setMessage(''), 1200);
    } catch (e) { setMessage(getErrorMessage(e)); }
  };
  return <div className="rating-control"><div className="stars" aria-label={`Average rating ${average} out of 5`}>{[1,2,3,4,5].map((n) => <button key={n} className={n <= score ? 'selected' : ''} onClick={() => rate(n)} aria-label={`Rate ${n} stars`}><Star size={18} fill={n <= score ? 'currentColor' : 'none'} /></button>)}<span>{Number(average).toFixed(1)} <small>({count})</small></span></div>{showThumbs && <div className="thumbs"><button onClick={() => rate(score || 5, 'up')} aria-label="Thumbs up"><ThumbsUp size={17} /></button><button onClick={() => rate(score || 3, 'down')} aria-label="Thumbs down"><ThumbsDown size={17} /></button></div>}{message && <small className="status-inline">{message}</small>}</div>;
}
