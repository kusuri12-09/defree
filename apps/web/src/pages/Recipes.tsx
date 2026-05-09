import React from 'react';
import { useRecipeRecommendations } from '@/services/useRecipes';

export const Recipes: React.FC = () => {
  const { data, isLoading } = useRecipeRecommendations();
  const recipes = [...(data?.canMakeNow || []), ...(data?.nearlyPossible || [])];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">레시피 추천</h1>
      <p className="text-sm text-neutral-500">내 재료로 바로 만들 수 있어요</p>
      
      {isLoading ? (
        <div className="flex justify-center p-10"><span className="animate-spin text-2xl">⏳</span></div>
      ) : recipes.length === 0 ? (
         <div className="py-10 text-center text-neutral-500">
           <p>추천할 레시피가 없습니다.</p>
         </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-surface rounded-xl overflow-hidden shadow-sm border border-neutral-100 relative">
              {recipe.usesExpiringIngredients && (
                <div className="absolute top-2 left-2 bg-warning text-white text-xs font-bold px-2 py-1 rounded-md">
                  강력 추천
                </div>
              )}
              <div className="h-32 bg-neutral-100 flex items-center justify-center">
                <img src={recipe.thumbnailUrl || 'https://via.placeholder.com/400x200?text=Recipe'} alt={recipe.title} className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{recipe.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">⏱ {recipe.cookTimeMinutes || 15}분 · 부족 재료 {recipe.missingCount}개</p>
                <div className="mt-3 flex justify-between items-center text-primary text-sm font-medium">
                  <span>{recipe.missingCount === 0 ? '✅ 바로 요리 가능' : '🛒 조금만 사면 가능'}</span>
                  <button className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    레시피 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
