import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TitleSlide } from './components/slides/TitleSlide';
import { ProblemSlide } from './components/slides/ProblemSlide';
import { Solution1Slide } from './components/slides/Solution1Slide';
import { Solution2Slide } from './components/slides/Solution2Slide';
import { FutureSlide } from './components/slides/FutureSlide';

const slides = [
  <TitleSlide key="1" />,
  <ProblemSlide key="2" />,
  <Solution1Slide key="3" />,
  <Solution2Slide key="4" />,
  <FutureSlide key="5" />
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current]);

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(current - 1);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dark-900 bg-gradient-dark-mesh flex items-center justify-center text-slate-100">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-50">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === idx ? 'bg-primary scale-125' : 'bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Click Areas */}
      <div className="absolute top-0 left-0 w-1/4 h-full z-40 cursor-w-resize" onClick={prevSlide} />
      <div className="absolute top-0 right-0 w-1/4 h-full z-40 cursor-e-resize" onClick={nextSlide} />
    </div>
  );
}
