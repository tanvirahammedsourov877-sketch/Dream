'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password) { setError('Enter your email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === 'signup') {
      setError(null);
      setSuccess('Account created successfully! You can now sign in.');
      setMode('signin');
      setPassword('');
      return;
    }
    router.push('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50/80 via-[#f8fafc] to-amber-50/50 px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center justify-center transition hover:opacity-90" aria-label="Webnibo Home">
            <img src="/webnibo.png" alt="Webnibo" className="h-10 w-auto object-contain mx-auto" />
          </a>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-amber-700">Admin Control Center</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'signin' ? 'Sign in to admin' : 'Create admin account'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'signin'
              ? 'Manage products, prices, and categories.'
              : 'Set up your admin account to start managing the marketplace.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>
            )}

            {success && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{success}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-sm font-normal text-slate-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 disabled:opacity-60"
            >
              {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign in' : 'Create account')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              {mode === 'signin' ? "Don't have an admin account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null); }}
                className="font-medium text-amber-700 hover:text-amber-800"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <a href="/" className="transition hover:text-amber-700 hover:underline">← Back to marketplace</a>
        </p>
      </div>
    </div>
  );
}
