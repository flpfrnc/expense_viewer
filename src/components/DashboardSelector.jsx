'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDashboard } from '@/actions/dashboard';
import { PlusCircle } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export default function DashboardSelector({ dashboards, activeId }) {
  const { t } = useLocale();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (e) => {
    if (e.target.value === 'new') {
      setIsCreating(true);
    } else {
      router.push(`/?dashboardId=${e.target.value}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const newSb = await createDashboard(newName);
      setIsCreating(false);
      setNewName('');
      router.push(`/?dashboardId=${newSb.id}`);
    } catch (error) {
      alert("Error creating dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (isCreating || dashboards.length === 0) {
    return (
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input 
          autoFocus
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('createNew')}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap disabled:opacity-50"
        >
          {loading ? '...' : t('create')}
        </button>
        {dashboards.length > 0 && (
          <button 
            type="button" 
            onClick={() => setIsCreating(false)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium whitespace-nowrap"
          >
            {t('cancel')}
          </button>
        )}
      </form>
    );
  }

  return (
    <div className="mb-6 flex items-center gap-3">
      <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{t('selectDashboard')}</label>
      <div className="relative inline-block w-48">
        <select 
          value={activeId} 
          onChange={handleSelect}
          className="block w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-3 pr-8 rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 font-medium"
        >
          {dashboards.map(db => (
            <option key={db.id} value={db.id}>{db.name}</option>
          ))}
          <option value="new" className="font-bold text-blue-600">
            {t('createNew')}
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
}
