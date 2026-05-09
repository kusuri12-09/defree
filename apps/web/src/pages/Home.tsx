import React from 'react';

export const Home: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center py-2">
        <h1 className="text-xl font-bold">🍱 defree</h1>
        <div className="relative">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] text-white">
            1
          </span>
        </div>
      </header>

      <section className="bg-primary-light p-4 rounded-xl">
        <h2 className="text-lg font-semibold text-primary">안녕하세요, 승리 님!</h2>
        <p className="text-sm text-neutral-500 mt-1">오늘 소비 기한 임박 3개</p>
      </section>

      <section>
        <h3 className="text-md font-semibold mb-3">⚠️ 임박 재료</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-surface p-3 rounded-xl shadow-sm border border-danger/20">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🍅</span>
              <div>
                <p className="font-medium">방울토마토</p>
                <p className="text-xs text-neutral-500">1봉 남음</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-danger text-white text-xs font-bold rounded-full">D-1</span>
          </div>
        </div>
      </section>

      <button className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors">
        <span className="text-xl mr-2">📷</span>
        <span className="font-bold">영수증 스캔하기</span>
      </button>
    </div>
  );
};
