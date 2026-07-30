'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', decodeURIComponent(user));
      window.dispatchEvent(new Event('auth-storage'));
    }

    setTimeout(() => router.push('/'), 500);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
        <p className="text-text-secondary">Accesso in corso...</p>
      </div>
    </div>
  );
}
