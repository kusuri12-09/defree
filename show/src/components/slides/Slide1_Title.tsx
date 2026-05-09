import { motion } from 'framer-motion';
import { ChefHat, BellRing, Utensils, Scan } from 'lucide-react';

export const Slide1_Title = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* Background Orbit Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-[500px] h-[500px] rounded-full border border-primary border-dashed absolute"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-[700px] h-[700px] rounded-full border border-primary-light/50 border-dashed absolute"
        />
      </div>

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-primary font-bold tracking-widest mb-4"
        >
          배달 앱 대신 냉장고를 켜게 만드는 힘
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative inline-flex items-center justify-center"
        >
          {/* Logo Center */}
          <div className="bg-dark-900 z-10 px-10 py-6 rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-primary-light">
              defree
            </h1>
          </div>

          {/* Orbiting Icons */}
          <motion.div 
            initial={{ opacity: 0, x: -150, y: -100 }}
            animate={{ opacity: 1, x: -180, y: -120 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute glass-panel p-4 rounded-full flex items-center space-x-2 text-primary-light"
          >
            <Scan className="w-6 h-6" />
            <span className="font-bold">스캔</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 150, y: -100 }}
            animate={{ opacity: 1, x: 180, y: -120 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="absolute glass-panel p-4 rounded-full flex items-center space-x-2 text-primary-light"
          >
            <BellRing className="w-6 h-6" />
            <span className="font-bold">알림</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 100 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="absolute glass-panel p-4 rounded-full flex items-center space-x-2 text-primary-light"
          >
            <Utensils className="w-6 h-6" />
            <span className="font-bold">레시피</span>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-28 text-xl md:text-2xl text-slate-300 font-light"
        >
          필요한 만큼만(<span className="text-primary font-bold">degree</span>), 
          죄책감에서 자유롭게(<span className="text-primary font-bold">free</span>)
        </motion.p>
      </div>
    </div>
  );
};
