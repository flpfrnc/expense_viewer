'use client';
import React, { useTransition } from 'react';
import { formatCurrency } from '@/utils/currency';
import { incrementInstallment } from '@/actions/dashboard';
import { Plus } from 'lucide-react';

export default function InstallmentCard({ expense, isReadOnly }) {
  const [isPending, startTransition] = useTransition();
  const progress = (expense.paid_installments / expense.installments) * 100;
  const isFullyPaid = expense.paid_installments >= expense.installments;

  const handleIncrement = () => {
    if (!expense.id || isFullyPaid || isReadOnly) return;
    startTransition(() => {
      incrementInstallment(expense.id, expense.paid_installments, expense.installments);
    });
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 transition-opacity ${isFullyPaid ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold ${isFullyPaid && !isReadOnly ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{expense.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">
            {expense.paid_installments}/{expense.installments} installments
          </span>
          {!isReadOnly && (
            <button 
              onClick={handleIncrement}
              disabled={isPending || isFullyPaid}
              className="p-1 border border-slate-200 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Mark next installment as paid"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
        <div
          className={`h-2.5 rounded-full ${isFullyPaid ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Amount per part: <strong className="text-slate-700">{formatCurrency(expense.installment_amount)}</strong></span>
        <span className="text-slate-500">Total: {formatCurrency(expense.total_amount)}</span>
      </div>
    </div>
  );
}
