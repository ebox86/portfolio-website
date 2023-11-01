import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

interface PageTransitionProps {
  children: ReactNode;
  key: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, key }) => {
  return (
    <motion.div
      key={key}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
