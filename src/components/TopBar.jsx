'use client';

import { useState, useEffect } from 'react';
import { Share2, LogOut, Check } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function TopBar({ secretKey, activeDashboardId }) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleShare = () => {
    if (!activeDashboardId) return alert("Select a dashboard first!");
    // Generate the shareable link with the secret uuid and the dashboard param
    const shareLink = `${baseUrl}/${secretKey}?dashboardId=${activeDashboardId}`;
    
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-slate-800">Expense Viewer</h1>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Link Copied!' : 'Share Dashboard'}
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
