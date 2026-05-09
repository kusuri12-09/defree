import React from 'react';
import { useShoppingList, useGenerateShoppingList } from '@/services/useShopping';

export const Shopping: React.FC = () => {
  const { data, isLoading } = useShoppingList();
  const generateMutation = useGenerateShoppingList();

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">이번 주 장보기</h1>
        <button 
          onClick={handleGenerate} 
          disabled={generateMutation.isPending}
          className="text-xs bg-primary text-white px-3 py-1 rounded-full font-bold"
        >
          {generateMutation.isPending ? '분석 중...' : 'AI 자동 추천'}
        </button>
      </div>

      <div className="bg-primary-light p-4 rounded-xl border border-primary/20">
        <p className="text-sm text-primary font-medium">💡 냉장고 재고 분석 중</p>
        <p className="text-md mt-1 font-bold text-neutral-900">
          "계란이 있으니 대파만 사세요!"
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10"><span className="animate-spin text-2xl">⏳</span></div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-10 text-center text-neutral-500">
          <p>장바구니가 비어있습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.items.map((item) => (
            <label key={item.id} className="flex items-center p-3 bg-surface rounded-xl shadow-sm border border-neutral-100 cursor-pointer">
              <input type="checkbox" defaultChecked={item.isPurchased} className="w-5 h-5 text-primary rounded border-neutral-300 focus:ring-primary" />
              <div className="ml-3 flex-1 flex justify-between items-center">
                <span className={`font-medium ${item.isPurchased ? 'line-through text-neutral-400' : ''}`}>{item.ingredientName}</span>
                <span className="text-xs text-neutral-500">{item.quantity}{item.unit}</span>
              </div>
            </label>
          ))}
        </div>
      )}

      {data && data.items.length > 0 && (
        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg mt-6">
          장봤어요 (완료 처리)
        </button>
      )}
    </div>
  );
};
