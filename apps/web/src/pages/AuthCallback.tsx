import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider') || 'google';
    
    if (code) {
      api.post(`/auth/${provider}`, { 
        code, 
        redirectUri: `${window.location.origin}/auth/callback` 
      })
      .then((res) => {
        const { accessToken, user } = res.data.data;
        setAuth(accessToken, user);
        navigate('/');
      })
      .catch((err) => {
        console.error('Login failed', err);
        navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <p className="text-lg font-bold text-primary animate-pulse">로그인 처리 중입니다...</p>
    </div>
  );
};
