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

    const seen = new WeakSet();
    let observer;
    let mutationObserver;
    let rafId = 0;
    let sequence = 0;

    const prepare = (el) => {
      if (!el || seen.has(el)) return;

      seen.add(el);
      const delay = Math.min((sequence % 5) * 55, 220);
      sequence += 1;

      el.style.setProperty('--motion-delay', `${delay}ms`);
      el.classList.add('motion-watch');

      // Elements already well inside the viewport still get a short entrance,
      // but are revealed on the next frame to prevent layout flashes.
      observer.observe(el);
    };

    const scan = (scope = document) => {
      scope.querySelectorAll?.(SELECTORS).forEach(prepare);

      if (scope.nodeType === 1 && scope.matches?.(SELECTORS)) {
        prepare(scope);
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          requestAnimationFrame(() => {
            entry.target.classList.add('motion-inview');
          });
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -3% 0px'
      }
    );

    // Initial content.
    rafId = requestAnimationFrame(() => scan(document));

    // API-loaded cards/sections arrive after the first paint. Observe them too.
    mutationObserver = new MutationObserver((mutations) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) scan(node);
          });
        });
      });
    });

    mutationObserver.observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [location.pathname, location.search, reducedMotion]);

  return null;
}
