import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('fanhub_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fanhub_font_size') || 'medium');
  const [reducedMotion, setReducedMotion] = useState(() => {
    // Responsive work previously left some browsers with reduced motion persisted,
    // which makes every transition instantaneous. Reset that stale preference once.
    const motionVersion = 'smooth-motion-v3';
    const storedVersion = localStorage.getItem('fanhub_motion_pref_version');

    if (storedVersion !== motionVersion) {
      localStorage.setItem('fanhub_motion_pref_version', motionVersion);
      localStorage.setItem('fanhub_reduced_motion', 'false');
      return false;
    }

    return localStorage.getItem('fanhub_reduced_motion') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.fontSize = fontSize;
    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
    document.body.className = `theme-${theme}`;
    localStorage.setItem('fanhub_theme', theme);
    localStorage.setItem('fanhub_font_size', fontSize);
    localStorage.setItem('fanhub_reduced_motion', String(reducedMotion));
  }, [theme, fontSize, reducedMotion]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((v) => v === 'light' ? 'dark' : 'light'),
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion
  }), [theme, fontSize, reducedMotion]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export const useUi = () => useContext(UiContext);
