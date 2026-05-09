import { motion } from 'framer-motion'
import { User, Package, BellDot, AlertTriangle } from 'lucide-react'

export const Slide4_UXPrinciple = () => {
  const principles = [
    {
      icon: <User className="w-8 h-8 text-primary" />,
      title: '1인분 레시피 고정',
      desc: '모든 추천 레시피 분량을 1인용으로 자동 환산',
    },
    {
      icon: <Package className="w-8 h-8 text-[#3b82f6]" />,
      title: '소포장 우선 추천',
      desc: '장바구니 생성 시 낱개 상품 최상단 노출',
    },
    {
      icon: <BellDot className="w-8 h-8 text-[#f59e0b]" />,
      title: '조기 알림 시스템',
      desc: '1인 소비 속도를 고려한 D-3 선제적 알림',
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-danger" />,
      title: '소비 가능량 경고',
      desc: '"혼자 다 드시려면 3일간 3끼를 다 요리해야 해요."',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-primary font-bold tracking-widest mb-2 uppercase">UX Principle</p>
        <h2 className="text-4xl md:text-5xl font-bold">1인 가구만을 위한 4가지 설계 원칙</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        {principles.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.2 }}
            className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="p-4 bg-dark-900 rounded-2xl border border-white/10 shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
