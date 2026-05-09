import { motion } from 'framer-motion';
import { RefreshCw, Bell, ChefHat, CheckSquare, Search } from 'lucide-react';

export const Slide6_ChainEngine = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <p className="text-primary font-bold tracking-widest mb-2 uppercase">Core Feature ②</p>
        <h2 className="text-4xl md:text-5xl font-bold">연쇄 소비 레시피 엔진</h2>
        <p className="text-xl text-slate-400 mt-4">버려지는 식재료 0%를 위한 'Chain-Recommendation'</p>
      </motion.div>

      <div className="relative w-full max-w-2xl aspect-square md:aspect-video flex items-center justify-center">
        {/* 중앙 아이콘 (Loop) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute opacity-20"
        >
          <RefreshCw className="w-64 h-64 text-primary" />
        </motion.div>

        <div className="grid grid-cols-2 gap-8 md:gap-16 relative z-10 w-full h-full p-8">
          <motion.div initial={{ opacity: 0, x: -50, y: -50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <Bell className="w-10 h-10 text-warning mb-3" />
            <p className="font-bold">1. 유통기한 알림</p>
            <p className="text-xs text-slate-400 mt-2">D-3 임박 식재료 푸시</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 50, y: -50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <ChefHat className="w-10 h-10 text-primary mb-3" />
            <p className="font-bold">2. 레시피 추천</p>
            <p className="text-xs text-slate-400 mt-2">보유 재료 100% 활용</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <Search className="w-10 h-10 text-[#3b82f6] mb-3" />
            <p className="font-bold">4. 다음 끼니 제안</p>
            <p className="text-xs text-slate-400 mt-2">남은 부재료 연쇄 소비</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <CheckSquare className="w-10 h-10 text-primary-light mb-3" />
            <p className="font-bold">3. 조리 및 재고 차감</p>
            <p className="text-xs text-slate-400 mt-2">자동 인벤토리 동기화</p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 bg-primary/20 border border-primary px-8 py-4 rounded-full text-center"
      >
        <span className="text-primary-light font-bold">Point.</span> 배달비 3,500원을 아낄 수 있는 실질적 경제 보상 제시
      </motion.div>
    </div>
  );
};
