import React from 'react'
import { useAuthStore } from '@/stores/authStore'

export const MyPage: React.FC = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">마이페이지</h1>

      {user ? (
        <div className="flex items-center space-x-4 bg-surface p-4 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-2xl">
            {user.name?.[0] || '👤'}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
      ) : (
        <div className="bg-surface p-4 rounded-xl shadow-sm text-center py-8">
          <p className="text-neutral-500 mb-4">로그인이 필요합니다.</p>
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'}/auth/google/login`}
            className="bg-primary text-white px-6 py-2 rounded-full font-bold"
          >
            Google 로그인
          </a>
        </div>
      )}

      {user && (
        <>
          <section>
            <h3 className="text-md font-bold mb-3">알림 설정</h3>
            <div className="bg-surface rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-neutral-100">
                <span>유통기한 임박 알림 (앱)</span>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4">
                <span>Discord 연동 알림</span>
                <div className="w-10 h-6 bg-neutral-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <button
              onClick={handleLogout}
              className="w-full text-danger bg-danger/10 py-3 rounded-xl font-bold"
            >
              로그아웃
            </button>
          </section>
        </>
      )}
    </div>
  )
}
