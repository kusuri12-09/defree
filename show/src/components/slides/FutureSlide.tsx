import { motion } from 'framer-motion'
import { ShoppingCart, Sparkles } from 'lucide-react'

export const FutureSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 mb-8"
      >
        <Sparkles className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-6"
      >
        스마트 장보기 가이드
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-slate-400 max-w-2xl mb-12"
      >
        "지난주에 사고 남은 고추장과 참기름을 활용하려면,
        <br />
        이번 장보기에서는 <span className="text-primary font-bold">감자와 양파</span>만 사세요!"
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-panel p-6 rounded-2xl flex items-center space-x-6 border-primary/40"
      >
        <div className="bg-dark-900 p-4 rounded-xl">
          <ShoppingCart className="w-8 h-8 text-primary-light" />
        </div>
        <div className="text-left">
          <p className="font-bold text-lg">완벽한 가계부 겸 레시피 서비스</p>
          <p className="text-sm text-slate-400">장보기 전부터 버려지는 것을 막는 선순환</p>
        </div>
      </motion.div>
    </div>
  )
}
