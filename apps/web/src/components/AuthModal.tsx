'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Chrome } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Errore');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-4xl shadow-premium-lg w-full max-w-md p-6 md:p-8 animate-scale-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-surface-2 rounded-xl transition-colors">
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {mode === 'login' ? 'Benvenuto' : 'Crea account'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {mode === 'login' ? 'Accedi per usare AutoEsperto' : 'Registrati per iniziare'}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-2xl border-2 border-border bg-white text-text-primary font-semibold flex items-center justify-center gap-3 hover:bg-surface-2 hover:border-accent/30 transition-all mb-4"
        >
          <Chrome className="w-5 h-5" />
          Continua con Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-tertiary font-medium">oppure</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-border bg-surface-2 text-text-primary outline-none focus:border-accent focus:bg-white input-premium transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com"
                required
                className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-border bg-surface-2 text-text-primary outline-none focus:border-accent focus:bg-white input-premium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimo 6 caratteri"
                required
                minLength={6}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-border bg-surface-2 text-text-primary outline-none focus:border-accent focus:bg-white input-premium transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger-light border border-danger/20 rounded-xl p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl gradient-bg text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-premium active:scale-[0.98] transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {mode === 'login' ? 'Accedi' : 'Registrati'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-5">
          {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-accent font-semibold ml-1 hover:underline"
          >
            {mode === 'login' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  );
}
