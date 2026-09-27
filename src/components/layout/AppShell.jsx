import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';

function resetPageScroll() {
  const html = document.documentElement;
  const body = document.body;

  // Temporarily disable CSS smooth scrolling and browser scroll anchoring.
  const oldHtmlBehavior = html.style.scrollBehavior;
  const oldBodyBehavior = body.style.scrollBehavior;
  const oldHtmlAnchor = html.style.overflowAnchor;
  const oldBodyAnchor = body.style.overflowAnchor;

  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';
  html.style.overflowAnchor = 'none';
  body.style.overflowAnchor = 'none';

  const reset = () => {
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    body.scrollTop = 0;

    document.querySelectorAll(
      '.app-main-region, .route-stage, .reference-shell'
    ).forEach((el) => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
  };

  // Do it immediately and again after React/browser paint.
  reset();
  const frame1 = requestAnimationFrame(reset);
  const frame2 = requestAnimationFrame(() => requestAnimationFrame(reset));
  const t1 = setTimeout(reset, 40);
  const t2 = setTimeout(reset, 140);

  const cleanupTimer = setTimeout(() => {
    html.style.scrollBehavior = oldHtmlBehavior;
    body.style.scrollBehavior = oldBodyBehavior;
    html.style.overflowAnchor = oldHtmlAnchor;
    body.style.overflowAnchor = oldBodyAnchor;
  }, 220);

  return () => {
    cancelAnimationFrame(frame1);
    cancelAnimationFrame(frame2);
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(cleanupTimer);
    html.style.scrollBehavior = oldHtmlBehavior;
    body.style.scrollBehavior = oldBodyBehavior;
    html.style.overflowAnchor = oldHtmlAnchor;
    body.style.overflowAnchor = oldBodyAnchor;
  };
}

export default function AppShell() {
  const location = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return resetPageScroll();
  }, [location.pathname, location.search, location.key]);

  return <div id="top" className="app-shell reference-shell">
    <Navbar/>
    <main className="app-main-region">
      <AnimatePresence mode="wait">
        <div key={`${location.pathname}${location.search}`} className="route-stage">
          <Outlet/>
        </div>
      </AnimatePresence>
    </main>
    <Footer/>
    <Chatbot/>
  </div>;
}
