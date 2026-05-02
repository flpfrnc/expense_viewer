'use client';
import React, { useTransition } from 'react';
import { formatCurrency } from '@/utils/currency';
import { toggleMonthlyHistoryStatus } from '@/actions/dashboard';
import { ChevronDown, CheckCircle, Circle } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export default function HistoryAccordion({ historyItem, isReadOnly }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  const detailsArray = typeof historyItem.details === 'string'
    ? JSON.parse(historyItem.details) : historyItem.details;

  const isPaid = historyItem.status === 'paid';
  const statusLabel = t(historyItem.status) || t('pending');

  const getDetailLabel = (detail) => {
    if (detail.kind === 'installment' && detail.installmentNumber && detail.installmentTotal) {
      return `${t('installmentDetail')} ${detail.installmentNumber}/${detail.installmentTotal}`;
    }
    return detail.status === 'paid' ? t('paid') : null;
  };

  const handleToggleEvent = (e) => {
    e.preventDefault(); // Prevent accordion from toggling when clicking the button
    if (!historyItem.id || isReadOnly) return;
    startTransition(() => {
      toggleMonthlyHistoryStatus(historyItem.id, historyItem.status);
    });
  };

  return (
    <details className={`group bg-white rounded-xl shadow-sm border-l-4 cursor-pointer mb-3 transition-colors ${isPaid ? 'border-green-500 bg-green-50/10' : 'border-amber-400'}`}>
      <summary className="p-4 flex justify-between items-center list-none outline-none">
        <div className="flex items-center gap-3">
          <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
          <span className="font-bold text-slate-800 text-sm">{historyItem.month}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-bold ${isPaid ? 'text-green-600' : 'text-slate-800'}`}>{formatCurrency(historyItem.total_amount)}</span>
          {!isReadOnly && (
            <button
              onClick={handleToggleEvent}
              disabled={isPending}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {isPaid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-amber-500" />}
              <span className={isPaid ? 'text-green-700' : 'text-amber-700'}>{statusLabel}</span>
            </button>
          )}
          {isReadOnly && (
             <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
               {isPaid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-amber-500" />}
               <span className={isPaid ? 'text-green-700' : 'text-amber-700'}>{statusLabel}</span>
             </div>
          )}
        </div>
      </summary>
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2 rounded-b-xl">
        {detailsArray?.map((detail, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50 last:border-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-slate-600 truncate ${detail.status === 'paid' ? 'line-through text-slate-400' : ''}`}>
                {detail.name}
              </span>
              {getDetailLabel(detail) && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${detail.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {getDetailLabel(detail)}
                </span>
              )}
            </div>
            <span className={`font-medium ${detail.status === 'paid' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {formatCurrency(detail.amount)}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}