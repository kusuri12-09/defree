import { motion } from 'framer-motion';
import { Layers, Server, Box, Cpu } from 'lucide-react';

export const Slide7_TechStack = () => {
  const stack = [
    { icon: <Layers />, title: 'Frontend', desc: 'React, Vite, Zustand, TailwindCSS\n(PWA Web Push 지원)', color: 'text-cyan-400' },
    { icon: <Server />, title: 'Backend', desc: 'NestJS (Node.js), Turborepo\n모노레포 기반 아키텍처', color: 'text-red-400' },
    { icon: <Box />, title: 'Infrastructure', desc: 'AWS EC2, Docker Compose\n(PostgreSQL, Redis)', color: 'text-[#f59e0b]' },
    { icon: <Cpu />, title: 'AI Service', desc: 'OpenAI API (GPT-4o-mini)\nNaver Clova OCR', color: 'text-[#a855f7]' },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-[#3b82f6] font-bold tracking-widest mb-2 uppercase">Architecture</p>
        <h2 className="text-4xl md:text-5xl font-bold">안정성과 확장성을 잡은 테크 스택</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stack.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors"
          >
            <div className={`p-4 bg-dark-900 rounded-2xl ${item.color} shadow-lg`}>
              <div className="[&>svg]:w-10 [&>svg]:h-10">
                {item.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-slate-400 text-sm whitespace-pre-line">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
