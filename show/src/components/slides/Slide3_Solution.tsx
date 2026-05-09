import { motion } from 'framer-motion'
import { XCircle, CheckCircle2 } from 'lucide-react'

export const Slide3_Solution = () => {
  const oldSteps = ['마트 장보기', '수동 입력(실패)', '유통기한 망각', '폐기']
  const newSteps = ['영수증 스캔', '자동 재고 등록', '맞춤 알림', '1인분 소진']

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-4 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-primary font-bold tracking-widest mb-2 uppercase">Solution</p>
        <h2 className="text-4xl md:text-5xl font-bold">1인 가구 라이프사이클에 맞춘</h2>
        <p className="text-3xl font-black text-primary mt-2">'Zero-Entry' 관리</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {/* 기존 방식 (Red) */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-danger/5 border border-danger/20 p-8 rounded-3xl"
        >
          <div className="flex items-center space-x-3 mb-8">
            <XCircle className="w-8 h-8 text-danger" />
            <h3 className="text-2xl font-bold text-danger">기존 방식</h3>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-danger/20 -z-10"></div>
            {oldSteps.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-dark-900 border-2 border-danger/40 flex items-center justify-center text-slate-400 font-bold z-10">
                  {idx + 1}
                </div>
                <div
                  className={`p-4 rounded-xl flex-1 ${idx === 3 ? 'bg-danger/20 border border-danger font-bold text-white' : 'bg-dark-800 text-slate-400'}`}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* defree 방식 (Blue/Primary) */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/5 border border-primary/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.1)] relative"
        >
          <div className="absolute -top-4 -right-4 bg-primary text-white font-bold px-4 py-2 rounded-full transform rotate-12 shadow-lg">
            defree 방식!
          </div>
          <div className="flex items-center space-x-3 mb-8">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold text-primary">defree 방식</h3>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/30 -z-10"></div>
            {newSteps.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-dark-900 border-2 border-primary flex items-center justify-center text-primary font-bold z-10 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  {idx + 1}
                </div>
                <div className="p-4 rounded-xl flex-1 bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 font-bold text-white">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
