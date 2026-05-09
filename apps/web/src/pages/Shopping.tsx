import React from 'react';

export const Shopping: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">이번 주 장보기</h1>
      <div className="bg-primary-light p-4 rounded-xl border border-primary/20">
        <p className="text-sm text-primary font-medium">💡 현재 재고 분석 기반 추천</p>
        <p className="text-md mt-1 font-bold text-neutral-900">
          "계란이 있으니 대파만 사세요!"
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center p-3 bg-surface rounded-xl shadow-sm border border-neutral-100 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 text-primary rounded border-neutral-300 focus:ring-primary" />
          <div className="ml-3 flex-1 flex justify-between items-center">
            <span className="font-medium">대파 1단</span>
            <span className="text-primary text-sm font-bold">쿠팡 최저가 👉</span>
          </div>
        </label>
        <label className="flex items-center p-3 bg-surface rounded-xl shadow-sm border border-neutral-100 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 text-primary rounded border-neutral-300 focus:ring-primary" />
          <div className="ml-3 flex-1 flex justify-between items-center">
            <span className="font-medium">우유 900ml</span>
            <span className="text-primary text-sm font-bold">마켓컬리 👉</span>
          </div>
        </label>
      </div>

      <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg mt-6">
        장봤어요 (완료 처리)
      </button>
    </div>
  );
};
