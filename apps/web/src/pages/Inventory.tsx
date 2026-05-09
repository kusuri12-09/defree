import React from 'react';

export const Inventory: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">냉장고</h1>
      <div className="flex space-x-2 border-b border-neutral-100 pb-2">
        <button className="text-primary font-bold border-b-2 border-primary px-2">전체</button>
        <button className="text-neutral-500 px-2">채소</button>
        <button className="text-neutral-500 px-2">육류</button>
      </div>
      <section>
        <h3 className="text-md font-semibold text-danger mb-2">⚠️ 임박 (D-2 이하)</h3>
        <div className="bg-danger/5 p-3 rounded-xl border border-danger/10 flex justify-between items-center mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍅</span>
            <div>
              <p className="font-medium">방울토마토</p>
              <p className="text-xs text-neutral-500">1봉</p>
            </div>
          </div>
          <span className="text-danger font-bold text-sm">D-1</span>
        </div>
        <div className="bg-danger/5 p-3 rounded-xl border border-danger/10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧅</span>
            <div>
              <p className="font-medium">양파</p>
              <p className="text-xs text-neutral-500">2개</p>
            </div>
          </div>
          <span className="text-danger font-bold text-sm">D-2</span>
        </div>
      </section>
      <section className="pt-4">
        <h3 className="text-md font-semibold mb-2">양호</h3>
        <div className="bg-surface p-3 rounded-xl border border-neutral-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🥚</span>
            <div>
              <p className="font-medium">계란</p>
              <p className="text-xs text-neutral-500">10구</p>
            </div>
          </div>
          <span className="text-neutral-500 font-medium text-sm">D-10</span>
        </div>
      </section>
    </div>
  );
};
