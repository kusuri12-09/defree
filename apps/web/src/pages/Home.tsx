import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useIngredients } from '@/services/useIngredients'

export const Home: React.FC = () => {
  const { user } = useAuthStore()
  const { data: ingredientsData, isLoading } = useIngredients({ sort: 'expiryDate', order: 'asc' })

  const expiringIngredients =
    ingredientsData?.data.filter((item) => {
      const diff = new Date(item.expiryDate).getTime() - new Date().getTime()
      return diff <= 3 * 24 * 60 * 60 * 1000 // 3 days
    }) || []

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center py-2">
        <h1 className="text-xl font-bold">🍱 defree</h1>
        <div className="relative">
          <span className="text-2xl">🔔</span>
        </div>
      </header>

      <section className="bg-primary-light p-4 rounded-xl">
        <h2 className="text-lg font-semibold text-primary">
          안녕하세요, {user?.name || '게스트'} 님!
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          오늘 소비 기한 임박 {expiringIngredients.length}개
        </p>
        {!user && (
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'}/auth/google/login`}
            className="mt-3 inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            구글로 로그인
          </a>
        )}
      </section>

      <section>
        <h3 className="text-md font-semibold mb-3">⚠️ 임박 재료</h3>
        {isLoading ? (
          <p className="text-sm text-neutral-500 animate-pulse">로딩 중...</p>
        ) : expiringIngredients.length === 0 ? (
          <p className="text-sm text-neutral-500">임박한 재료가 없습니다. 훌륭해요!</p>
        ) : (
          <div className="space-y-2">
            {expiringIngredients.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-surface p-3 rounded-xl shadow-sm border border-danger/20"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.category?.iconEmoji || '📦'}</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.quantity}
                      {item.unit} 남음
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-danger text-white text-xs font-bold rounded-full">
                  {Math.ceil(
                    (new Date(item.expiryDate).getTime() - new Date().getTime()) /
                      (1000 * 3600 * 24),
                  )}
                  일 남음
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors">
        <span className="text-xl mr-2">📷</span>
        <span className="font-bold">영수증 스캔</span>
      </button>
    </div>
  )
}
