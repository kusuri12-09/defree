import { motion } from 'framer-motion';
import { Trash2, Frown } from 'lucide-react';

export const ProblemSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">자취생의 가장 아까운 돈</h2>
        <p className="text-xl text-danger font-medium">버려지는 음식물 쓰레기 값</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-dark p-8 rounded-3xl flex flex-col items-center text-center space-y-4"
        >
          <Frown className="w-16 h-16 text-slate-400" />
          <h3 className="text-2xl font-bold">검게 변해가는 애호박</h3>
          <p className="text-slate-400">
            된장찌개 하나 끓이려고 샀던 채소들,<br/>냉장고 구석에서 썩어갈 때의 죄책감.
          </p>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel-dark p-8 rounded-3xl flex flex-col items-center text-center space-y-4 border-danger/30"
        >
          <Trash2 className="w-16 h-16 text-danger" />
          <h3 className="text-2xl font-bold">남은 식재료 처리</h3>
          <p className="text-slate-400">
            도대체 남은 양파로 뭘 해야 할지 모름.<br/>결국 배달 음식을 시키고 악순환 반복.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
