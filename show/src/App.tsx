import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Slide1_Title } from './components/slides/Slide1_Title';
import { Slide2_Problem } from './components/slides/Slide2_Problem';
import { Slide3_Solution } from './components/slides/Slide3_Solution';
import { Slide4_UXPrinciple } from './components/slides/Slide4_UXPrinciple';
import { Slide5_AIPipeline } from './components/slides/Slide5_AIPipeline';
import { Slide6_ChainEngine } from './components/slides/Slide6_ChainEngine';
import { Slide7_TechStack } from './components/slides/Slide7_TechStack';
import { Slide8_AIDevelopment } from './components/slides/Slide8_AIDevelopment';
import { Slide9_BusinessModel } from './components/slides/Slide9_BusinessModel';
import { Slide10_Vision } from './components/slides/Slide10_Vision';

const slides = [
  <Slide1_Title key="1" />,
  <Slide2_Problem key="2" />,
  <Slide3_Solution key="3" />,
  <Slide4_UXPrinciple key="4" />,
  <Slide5_AIPipeline key="5" />,
  <Slide6_ChainEngine key="6" />,
  <Slide7_TechStack key="7" />,
  <Slide8_AIDevelopment key="8" />,
  <Slide9_BusinessModel key="9" />,
  <Slide10_Vision key="10" />
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
    <div className="relative w-screen h-screen overflow-hidden bg-dark-900 bg-gradient-dark-mesh flex items-center justify-center text-slate-100 font-sans">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-2 z-50">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
            className={`transition-all duration-300 rounded-full ${
              current === idx ? 'w-8 h-2 bg-primary shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'w-2 h-2 bg-white/20 hover:bg-white/50'
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
