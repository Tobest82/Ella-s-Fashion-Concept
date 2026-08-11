import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 10 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-[#121212] hover:bg-[#F4C430] text-[#F4C430] hover:text-black border border-[#333] hover:border-[#F4C430] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F4C430]/40"
          aria-label="Scroll to top of page"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
