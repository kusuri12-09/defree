import { motion } from 'framer-motion';
import { Receipt, ArrowRight, Refrigerator } from 'lucide-react';

export const Solution1Slide = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Solution 1: 영수증 스캔</h2>
        <p className="text-xl text-primary font-medium">장보기가 끝나면, 사진 한 장으로 재고 등록 완료</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 w-full">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-3xl w-64 h-80 flex flex-col items-center justify-center space-y-6"
        >
          <Receipt className="w-20 h-20 text-slate-300" />
          <p className="text-lg font-bold text-center">마트 영수증 찰칵!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden md:block"
        >
          <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-8 rounded-3xl w-64 h-80 flex flex-col items-center justify-center space-y-6 border-primary/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/10" />
          <Refrigerator className="w-20 h-20 text-primary z-10" />
          <div className="z-10 text-center">
            <p className="text-lg font-bold">자동 분류 & 유통기한</p>
            <p className="text-sm text-primary-light mt-2">OCR + AI 자동화</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
