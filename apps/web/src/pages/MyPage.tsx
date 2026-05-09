import React from 'react';

export const MyPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">마이페이지</h1>
      
      <div className="flex items-center space-x-4 bg-surface p-4 rounded-xl shadow-sm">
        <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-2xl">👤</div>
        <div>
          <h2 className="text-lg font-bold">승리 님</h2>
          <p className="text-sm text-neutral-500">user@example.com</p>
        </div>
      </div>

      <section>
        <h3 className="text-md font-bold mb-3">알림 설정</h3>
        <div className="bg-surface rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-neutral-100">
            <span>Web Push (브라우저)</span>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-4">
            <span>Discord Webhook</span>
            <div className="w-10 h-6 bg-neutral-200 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
