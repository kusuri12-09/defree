import { motion } from 'framer-motion'
import { Leaf, Coins, HeartHandshake } from 'lucide-react'

export const Slide10_Vision = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-8"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#3b82f6] mb-4">
          defree
        </h1>
        <p className="text-2xl font-light text-slate-300">
          낭비 없는 식탁, <span className="text-primary font-bold">지속 가능한 자취 생활</span>의
          시작
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12 w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center space-y-4 max-w-xs"
        >
          <Leaf className="w-12 h-12 text-primary" />
          <h3 className="text-xl font-bold">환경 가치</h3>
          <p className="text-sm text-slate-400">
            연간 가구당 음식물 쓰레기
            <br />
            배출량 30% 감소
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center space-y-4 max-w-xs"
        >
          <Coins className="w-12 h-12 text-[#f59e0b]" />
          <h3 className="text-xl font-bold">경제 가치</h3>
          <p className="text-sm text-slate-400">
            불필요한 중복 구매 방지로
            <br />월 평균 식비 절감
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center space-y-4 max-w-xs"
        >
          <HeartHandshake className="w-12 h-12 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">소셜 가치</h3>
          <p className="text-sm text-slate-400">
            "오늘 뭐 먹지?" 고민 없는
            <br />
            건강한 1인 가구 생태계 구축
          </p>
        </motion.div>
      </div>
    </div>
  )
}
