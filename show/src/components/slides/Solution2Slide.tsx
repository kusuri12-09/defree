import { motion } from 'framer-motion'
import { BellRing, ChefHat } from 'lucide-react'

export const Solution2Slide = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-8 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Solution 2: 선제적 알림 & 추천</h2>
        <p className="text-xl text-primary font-medium">유통기한 임박 전 먼저 다가가는 서비스</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <BellRing className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="bg-[#5865F2]/20 border border-[#5865F2] p-4 rounded-xl mb-6">
              <p className="text-[#5865F2] font-bold mb-1">Discord Bot</p>
              <p className="text-sm">
                "승리 님, 냉장고에 <span className="text-danger font-bold">방울토마토</span>가
                죽어가고 있어요!"
              </p>
            </div>
            <h3 className="text-2xl font-bold mb-2">친숙한 알림 연동</h3>
            <p className="text-slate-400">
              디스코드, 슬랙 등 자주 보는 플랫폼으로 알림 전송. 앱을 켜지 않아도 알려줍니다.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ChefHat className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="bg-primary/20 border border-primary p-4 rounded-xl mb-6 flex items-center space-x-4">
              <span className="text-4xl">🍝</span>
              <div>
                <p className="font-bold">방울토마토 파스타</p>
                <p className="text-xs text-primary-light">추가 구매 필요 없음! 15분 완성</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">꼬리를 무는 솔루션</h3>
            <p className="text-slate-400">
              단순 경고에서 끝나지 않고, 현재 남은 재료만으로 당장 만들 수 있는 요리를 추천합니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
