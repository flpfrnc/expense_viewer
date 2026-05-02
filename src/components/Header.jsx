'use client';
import React from 'react';
import { formatCurrency } from '@/utils/currency';
import { useLocale } from './LocaleProvider';

export default function Header({ total, title, titleKey }) {
  const { t } = useLocale();
  const finalTitle = (titleKey && t(titleKey)) || title || t('appTitle') || 'Current Month Forecast';
  return (
    <header className="mb-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{finalTitle}</h2>
        <p className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(total)}</p>
      </div>
    </header>
  );
}
