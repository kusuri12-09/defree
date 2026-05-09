import React from 'react';

export const Recipes: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">레시피 추천</h1>
      <p className="text-sm text-neutral-500">내 재료로 바로 만들 수 있어요</p>
      
      <div className="bg-surface rounded-xl overflow-hidden shadow-sm border border-neutral-100 relative">
        <div className="absolute top-2 left-2 bg-warning text-white text-xs font-bold px-2 py-1 rounded-md">
          임박 재료 포함
        </div>
        <div className="h-32 bg-neutral-100 flex items-center justify-center text-4xl">🍝</div>
        <div className="p-4">
          <h3 className="font-bold text-lg">방울토마토 파스타</h3>
          <p className="text-sm text-neutral-500 mt-1">⏱ 20분 · 재료 4/5개</p>
          <div className="mt-3 flex items-center text-primary text-sm font-medium">
            <span className="mr-1">✅</span> 추가 구매 불필요
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="h-32 bg-neutral-100 flex items-center justify-center text-4xl">🍳</div>
        <div className="p-4">
          <h3 className="font-bold text-lg">양파 계란볶음</h3>
          <p className="text-sm text-neutral-500 mt-1">⏱ 10분 · 재료 3/3개</p>
          <div className="mt-3 flex items-center text-primary text-sm font-medium">
            <span className="mr-1">✅</span> 추가 구매 불필요
          </div>
        </div>
      </div>
    </div>
  );
};
