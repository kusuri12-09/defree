import { motion } from 'framer-motion';
import { Camera, FileText, Brain, Database, ArrowRight } from 'lucide-react';

export const Slide5_AIPipeline = () => {
  const steps = [
    { icon: <Camera />, title: '영수증 촬영', desc: '스마트폰 카메라', color: 'text-slate-300', bg: 'bg-slate-300/10' },
    { icon: <FileText />, title: 'Clova OCR', desc: '텍스트 추출', color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: <Brain />, title: 'GPT-4o-mini', desc: '의미 분석 및 정규화', color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
    { icon: <Database />, title: '표준 DB', desc: '재고 등록', color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-[#a855f7] font-bold tracking-widest mb-2 uppercase">Core Tech ①</p>
        <h2 className="text-4xl md:text-5xl font-bold">AI 재고 자동화 파이프라인</h2>
        <p className="text-xl text-slate-400 mt-4">난해한 상품명을 깨끗한 데이터로</p>
      </motion.div>

      <div className="w-full flex justify-between items-center mb-16 relative">
        <div className="absolute left-10 right-10 h-1 bg-gradient-to-r from-slate-600 via-[#a855f7] to-[#3b82f6] top-1/2 -z-10 opacity-30"></div>
        
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.3 }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-full ${step.bg} border-2 border-white/20 flex items-center justify-center mb-4 backdrop-blur-md shadow-lg`}>
                <div className={`[&>svg]:w-10 [&>svg]:h-10 ${step.color}`}>
                  {step.icon}
                </div>
              </div>
              <p className="font-bold text-lg whitespace-nowrap">{step.title}</p>
              <p className="text-sm text-slate-400 whitespace-nowrap">{step.desc}</p>
            </motion.div>
            
            {idx < steps.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (idx * 0.3) + 0.15 }}
                className="mx-4 text-slate-600"
              >
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="glass-panel p-6 rounded-2xl w-full max-w-3xl flex justify-between items-center text-lg font-mono border-dashed"
      >
        <span className="text-danger-light bg-danger/10 px-3 py-1 rounded">삼양)라120*5</span>
        <ArrowRight className="text-slate-500" />
        <span className="text-primary bg-primary/10 px-3 py-1 rounded">라면(삼양, 5개입)</span>
        <span className="text-slate-400">+ 유통기한 6개월 부여</span>
      </motion.div>
    </div>
  );
};
