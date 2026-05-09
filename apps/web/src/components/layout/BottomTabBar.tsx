import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Refrigerator, ChefHat, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export const BottomTabBar: React.FC = () => {
  const tabs = [
    { name: '홈', path: '/', icon: Home },
    { name: '냉장고', path: '/inventory', icon: Refrigerator },
    { name: '레시피', path: '/recipes', icon: ChefHat },
    { name: '장보기', path: '/shopping', icon: ShoppingCart },
    { name: '마이', path: '/mypage', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-neutral-100 z-50">
      <ul className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <li key={tab.path} className="flex-1">
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center h-full w-full space-y-1',
                  isActive ? 'text-primary' : 'text-neutral-500 hover:text-neutral-900',
                )
              }
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
