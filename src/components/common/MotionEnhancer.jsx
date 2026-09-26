import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUi } from '../../context/UiContext';

const SELECTORS = [
  '.reference-hero',
  '.ref-section-head',
  '.reference-universe-card',
  '.community-post-card',
  '.reference-promo-banner',
  '.featured-anime-card',
  '.fh-community-post',
  '.fh-community-banner',
  '.fh-feature-card',
  '.fh-anime-spotlight',
  '.fh-story-lead',
  '.fh-story-editorial',
  '.fh-collector-feature',
  '.fh-collector-mini',
  '.right-rail-card',
  '.trending-row',
  '.top-character-row',
  '.content-card',
  '.article-card',
  '.media-card',
  '.merch-card',
  '.event-card',
  '.character-card',
  '.release-card',
  '.category-card',
  '.page-hero',
  '.filters-card',
  '.results-toolbar',
  '.detail-hero',
  '.category-hero',
  '.character-detail-layout',
  '.article-head',
  '.article-cover',
  '.calendar-toolbar',
  '.calendar-grid',
  '.feedback-card',
  '.dashboard-stats article',
  '.dashboard-panel',
  '.bookmark-list article',
  '.submission-list article',
  '.auth-card',
  '.auth-visual',
  '.admin-page-head',
  '.admin-metrics article',
  '.admin-panel',
  '.admin-table-wrap',
  '.faq-admin-grid article',
  '.reference-sitemap-grid > div',
  '.reference-sitemap-strip',
  '.footer-wordmark',
  '.footer-inline-links',
  '.footer-socials'
].join(',');

export default function MotionEnhancer() {
  const location = useLocation();
  const { reducedMotion } = useUi();

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('motion-reduced');
      document.querySelectorAll(SELECTORS).forEach((el) => {
        el.classList.remove('motion-watch');
        el.classList.add('motion-inview');
      });
      return () => root.classList.remove('motion-reduced');
    }

    root.classList.remove('motion-reduced');
    let observer;
    let raf = requestAnimationFrame(() => {
      const items = Array.from(document.querySelectorAll(SELECTORS));
      items.forEach((el, index) => {
        el.classList.add('motion-watch');
        el.classList.remove('motion-inview');
        el.style.setProperty('--motion-delay', `${Math.min((index % 6) * 45, 225)}ms`);
      });

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-inview');
            observer?.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -5% 0px'
      });

      items.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [location.pathname, location.search, reducedMotion]);

  return null;
}
