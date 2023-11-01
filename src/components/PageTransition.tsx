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
  route: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, route }) => {
  return (
    <motion.div
      key={route}
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
