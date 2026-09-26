import { motion } from 'framer-motion';
import { useUi } from '../../context/UiContext';

export default function PageTransition({ children, className = '' }) {
  const { reducedMotion } = useUi();
  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`page-motion-stage ${className}`.trim()}
      initial={{ opacity: 0, y: 14, scale: 0.997, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, scale: 0.998, filter: 'blur(2px)' }}
      transition={{
        opacity: { duration: 0.32 },
        y: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.30 }
      }}
    >
      {children}
    </motion.div>
  );
}
