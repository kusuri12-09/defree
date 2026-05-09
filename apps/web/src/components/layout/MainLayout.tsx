import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomTabBar } from './BottomTabBar'

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 max-w-md mx-auto shadow-sm overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
