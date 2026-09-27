import {
  ExternalLink,
  Headphones,
  Image,
  PlayCircle,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { MediaCard } from '../components/cards/Cards';
import { RatingControl, ShareButton } from '../components/common/Actions';
import { SkeletonGrid } from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import './MediaQuality.css';

const MEDIA_TYPES = ['video', 'trailer', 'audio', 'podcast', 'gallery', 'explainer'];

const labelize = (value = '') =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getMediaBadge = (item) => labelize(item?.type || 'media');

function MediaViewer({ item }) {
  const hasGallery = Array.isArray(item?.galleryImages) && item.galleryImages.length > 0;
  const isAudio = Boolean(item?.audioUrl) && !item?.embedUrl;
  const isEmbeddedVideo = Boolean(item?.embedUrl);
  const isLocalVideo =
    Boolean(item?.mediaUrl) &&
    ['video', 'trailer', 'explainer'].includes(item?.type);

  if (isEmbeddedVideo) {
    return (
      <div className="media-player-frame">
        <iframe src={item.embedUrl} title={item.title} allowFullScreen />
      </div>
    );
  }

  if (isLocalVideo) {
    return (
      <div className="media-player-frame">
        <video
          controls
          playsInline
          preload="metadata"
          poster={item.thumbnailUrl || undefined}
          src={item.mediaUrl}
          aria-label={item.title}
        />
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="media-audio-view">
        <div className="media-audio-art">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title} />
          ) : (
            <div className="media-audio-placeholder">
              <Headphones size={48} />
            </div>
          )}
          <div className="media-audio-overlay">
            <span className="media-type-pill">
              <Headphones size={14} />
              {getMediaBadge(item)}
            </span>
          </div>
        </div>

        <div className="media-audio-player">
          <span>{item.fandom || 'Fan Hub Plus Demo'} · Audio</span>
          <strong>{item.title}</strong>
          <audio controls src={item.audioUrl} />
        </div>
      </div>
    );
  }

  if (hasGallery) {
    return (
      <div className="media-gallery-view">
        {item.galleryImages.map((image, index) => (
          <figure
            className={`media-gallery-item ${index === 0 ? 'featured' : ''}`}
            key={index}
          >
            <img src={image} alt={`${item.title} ${index + 1}`} />
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="media-fallback-view">
      <img src={item.thumbnailUrl} alt={item.title} />
    </div>
  );
}

export default function Media() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [active, setActive] = useState(null);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCats(data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/media', {
        params: {
          ...Object.fromEntries(params.entries()),
          limit: 12,
        },
      })
      .then(({ data }) => {
        setItems(data.data || []);
        setMeta({
          page: data.page || 1,
          pages: data.pages || 1,
          total: data.total || 0,
        });
      })
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActive(null);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };

  const activeMeta = useMemo(() => {
    if (!active) return null;
    return `${active.fandom || 'Fan Hub'} · ${getMediaBadge(active)}`;
  }, [active]);

  return (
    <PageTransition>
      <div className="page-hero media-page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Media' }]} />
          <span className="eyebrow">INTERACTIVE MULTIMEDIA CENTER</span>
          <h1>Press play on every fandom.</h1>
          <p>
            Stream embedded trailers, explore galleries, discover audio,
            podcasts and animated explainers.
          </p>
          <div className="hero-trust">
            <span>
              <PlayCircle /> Video &amp; trailers
            </span>
            <span>
              <Headphones /> Audio &amp; podcasts
            </span>
            <span>
              <Image /> Galleries
            </span>
          </div>
        </div>
      </div>

      <section className="section container">
        <div className="inline-filters">
          <label className="search-field">
            <Search size={17} />
            <input
              placeholder="Search media…"
              value={params.get('search') || ''}
              onChange={(event) => update('search', event.target.value)}
            />
          </label>

          <select
            value={params.get('category') || ''}
            onChange={(event) => update('category', event.target.value)}
          >
            <option value="">All fandoms</option>
            {cats.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={params.get('type') || ''}
            onChange={(event) => update('type', event.target.value)}
          >
            <option value="">All media</option>
            {MEDIA_TYPES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : items.length ? (
          <div className="card-grid three">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => setActive(item)}
                className="click-card"
              >
                <MediaCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <Pagination
          page={meta.page}
          pages={meta.pages}
          onChange={(page) => update('page', String(page))}
        />
      </section>

      {active && createPortal(
        <div className="modal-backdrop media-modal-backdrop" onClick={() => setActive(null)}>
          <div
            className="media-modal"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close media-modal-close" onClick={() => setActive(null)}>
              <X size={20} />
            </button>

            <div className="media-viewer">
              <MediaViewer item={active} />
            </div>

            <div className="media-modal-copy">
              <div className="media-modal-heading-row">
                <div>
                  <span className="eyebrow">{activeMeta}</span>
                  <h2>{active.title}</h2>
                </div>
                <ShareButton title={active.title} />
              </div>

              <p className="media-modal-description">{active.description}</p>

              {(active.sourceUrl || active.rightsNote) && (
                <div className="media-source-note">
                  <div>
                    {active.sourceUrl && (
                      <a href={active.sourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} />
                        View original source
                      </a>
                    )}
                    {active.rightsNote && <small>{active.rightsNote}</small>}
                  </div>
                </div>
              )}

              <div className="media-modal-actions">
                <RatingControl
                  targetType="media"
                  targetId={active._id}
                  initialAverage={active.ratingAverage}
                  initialCount={active.ratingCount}
                  showThumbs
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageTransition>
  );
}
