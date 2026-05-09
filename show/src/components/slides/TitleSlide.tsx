import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export const TitleSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30"
      >
        <ChefHat className="w-16 h-16 text-primary" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-6xl md:text-8xl font-black tracking-tight"
      >
        defree
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-2xl md:text-3xl text-slate-400 font-light"
      >
        자취생을 위한 완벽한 <span className="text-primary font-bold">냉장고 매니저</span>
      </motion.p>
    </div>
  );
};
