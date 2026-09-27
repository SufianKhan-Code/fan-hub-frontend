import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Prevent the browser from restoring the previous page's footer/bottom position.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      const scrollingElement = document.scrollingElement || document.documentElement;
      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
        scrollingElement.scrollLeft = 0;
      }

      // Safety for any route-level containers that may become scrollable
      // at responsive breakpoints.
      document
        .querySelectorAll(
          '.app-main-region, .route-stage, .admin-content, .reference-admin-shell'
        )
        .forEach((element) => {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        });
    };

    // Immediate reset plus one post-paint reset prevents layout/route
    // transitions from restoring the old footer position.
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
