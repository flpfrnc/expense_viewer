'use client';

import { useState } from 'react';
import { login } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(password);
      if (res.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">Enter your password to access the dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
