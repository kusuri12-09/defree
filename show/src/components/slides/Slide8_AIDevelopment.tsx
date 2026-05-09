import { motion } from 'framer-motion'
import { Bot, Rocket, Zap, MessageSquare } from 'lucide-react'

export const Slide8_AIDevelopment = () => {
  const steps = [
    { icon: <Bot />, role: '설계', name: 'Antigravity', desc: '인프라 구조 자동 생성' },
    {
      icon: <MessageSquare />,
      role: '기획',
      name: 'Gemini',
      desc: 'NLP 프롬프트 및\n서비스 시나리오 최적화',
    },
    {
      icon: <Zap />,
      role: '구현',
      name: 'Claude Code & Codex',
      desc: '에이전트 기반\n실시간 리팩토링',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-primary-light font-bold tracking-widest mb-2 uppercase">Productivity</p>
        <h2 className="text-4xl md:text-5xl font-bold">AI 툴체인을 활용한 생산성 극대화</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-4"
          >
            <div className="p-4 bg-dark-900 rounded-2xl text-primary-light">
              <div className="[&>svg]:w-8 [&>svg]:h-8">{item.icon}</div>
            </div>
            <p className="text-sm font-bold text-slate-400">{item.role}</p>
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <p className="text-slate-300 whitespace-pre-line">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-panel bg-primary/10 border border-primary/30 px-8 py-6 rounded-2xl flex items-center space-x-6"
      >
        <Rocket className="w-12 h-12 text-primary" />
        <div className="text-left">
          <p className="text-sm text-primary-light font-bold">Development Result</p>
          <p className="text-2xl font-bold">
            전체 리소스 <span className="text-primary">65% 절감</span> 및 빠른 MVP 출시
          </p>
        </div>
      </motion.div>
    </div>
  )
}
