import { motion } from 'framer-motion'
import { ShoppingBag, LineChart, Users } from 'lucide-react'

export const Slide9_BusinessModel = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-[#f59e0b] font-bold tracking-widest mb-2 uppercase">Business Model</p>
        <h2 className="text-4xl md:text-5xl font-bold">사용자 절약이 수익이 되는 상생 구조</h2>
      </motion.div>

      <div className="space-y-6 w-full">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-3xl flex items-center space-x-6 border-l-4 border-l-[#f59e0b]"
        >
          <div className="p-4 bg-dark-900 rounded-xl text-[#f59e0b] shrink-0">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-1">커머스 딥링크</h3>
            <p className="text-slate-400">
              부족한 재료를 소포장 최저가로 바로 연결 (구매 수수료 수익)
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-3xl flex items-center space-x-6 border-l-4 border-l-[#3b82f6]"
        >
          <div className="p-4 bg-dark-900 rounded-xl text-[#3b82f6] shrink-0">
            <LineChart className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-1">데이터 비즈니스</h3>
            <p className="text-slate-400">
              1인 가구 식생활 소비 패턴 데이터 분석 및 B2B 인사이트 제공
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6 rounded-3xl flex items-center space-x-6 border-l-4 border-l-primary"
        >
          <div className="p-4 bg-dark-900 rounded-xl text-primary shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-1">확장성 (PB 상품)</h3>
            <p className="text-slate-400">1인용 밀키트 브랜드와의 PB 상품 기획 및 콜라보레이션</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
