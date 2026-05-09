import React from 'react';
import { useIngredients } from '@/services/useIngredients';

export const Inventory: React.FC = () => {
  const { data, isLoading } = useIngredients();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">냉장고</h1>
        <button className="text-primary text-sm font-bold bg-primary-light px-3 py-1 rounded-full">+ 직접 추가</button>
      </div>

      <div className="flex space-x-2 border-b border-neutral-100 pb-2 overflow-x-auto">
        <button className="text-primary font-bold border-b-2 border-primary px-2 whitespace-nowrap">전체</button>
        <button className="text-neutral-500 px-2 whitespace-nowrap">채소</button>
        <button className="text-neutral-500 px-2 whitespace-nowrap">육류</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10"><span className="animate-spin text-2xl">⏳</span></div>
      ) : data?.data?.length === 0 ? (
        <div className="py-10 text-center text-neutral-500">
          <p className="text-4xl mb-3">🌬️</p>
          <p>냉장고가 비어있어요!</p>
          <p className="text-sm mt-1">영수증을 스캔해서 채워보세요.</p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {data?.data?.map((item) => {
            const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            const isDanger = daysLeft <= 3;

            return (
              <div key={item.id} className={`p-3 rounded-xl border flex justify-between items-center shadow-sm ${isDanger ? 'bg-danger/5 border-danger/10' : 'bg-surface border-neutral-100'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.category?.iconEmoji || '🍎'}</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.quantity}{item.unit}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${isDanger ? 'text-danger' : 'text-neutral-500'}`}>
                  {daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? 'D-Day' : `D+${Math.abs(daysLeft)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
