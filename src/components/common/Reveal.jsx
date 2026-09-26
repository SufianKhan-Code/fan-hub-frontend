import { motion } from 'framer-motion';
import { useUi } from '../../context/UiContext';

export default function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const { reducedMotion } = useUi();
  if (reducedMotion) return <div className={className}>{children}</div>;

  const offset = direction === 'left'
    ? { x: -22, y: 0 }
    : direction === 'right'
      ? { x: 22, y: 0 }
      : { x: 0, y: 22 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset, scale: 0.995, filter: 'blur(2px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
