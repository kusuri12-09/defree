import { motion } from 'framer-motion';

export const Slide2_Problem = () => {
  const steps = [
    { step: '과잉 구매', desc: '마트의 대용량 규격', result: '식재료 과부하', width: 'w-full', delay: 0.2 },
    { step: '망각/방치', desc: '냉장고 속 재료 파악 실패', result: '유통기한 경과', width: 'w-[80%]', delay: 0.4 },
    { step: '번거로움', desc: '수동 입력의 귀찮음', result: '관리 포기 및 배달 주문', width: 'w-[60%]', delay: 0.6 },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl px-8 w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <p className="text-danger font-bold tracking-widest mb-2 uppercase">Problem</p>
        <h2 className="text-4xl md:text-5xl font-bold">750만 1인 가구의 식재료 잔혹사</h2>
        <p className="text-2xl text-slate-400 mt-4">"왜 결국 버리게 될까?"</p>
      </motion.div>

      <div className="flex flex-col items-center w-full space-y-4">
        {steps.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className={`${item.width} bg-dark-800/80 border border-danger/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden backdrop-blur-md`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-danger/80"></div>
            <div className="flex-1 pl-4">
              <h3 className="text-xl font-bold text-slate-200">{item.step}</h3>
              <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-danger font-bold bg-danger/10 px-4 py-2 rounded-full border border-danger/20">
                {item.result}
              </span>
            </div>
          </motion.div>
        ))}
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-6xl"
        >
          💸 🗑️
        </motion.div>
      </div>
    </div>
  );
};
