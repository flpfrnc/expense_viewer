'use client';
import React, { useTransition } from 'react';
import { formatCurrency } from '@/utils/currency';
import { toggleOneTimeExpenseStatus, deleteOneTimeExpense } from '@/actions/dashboard';
import { Trash } from 'lucide-react';
import { CheckCircle, Circle } from 'lucide-react';

export default function OneTimeExpense({ expense, isReadOnly }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!expense.id || isReadOnly) return; // If local only
    startTransition(() => {
      toggleOneTimeExpenseStatus(expense.id, expense.status);
    });
  };

  const isPaid = expense.status === 'paid';

  const handleDelete = () => {
    if (!expense.id || isReadOnly) return;
    if (!confirm(`Delete "${expense.name}"? This action cannot be undone.`)) return;
    startTransition(() => {
      deleteOneTimeExpense(expense.id);
    });
  };

  return (
    <div className={`flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-2 transition-all ${isPaid ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-3">
        {!isReadOnly && (
          <button 
            onClick={handleToggle} 
            disabled={isPending}
            className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            title={isPaid ? "Mark as pending" : "Mark as paid"}
          >
            {isPaid ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
          </button>
        )}
        <span className={`font-medium ${isPaid && !isReadOnly ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{expense.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-800">{formatCurrency(expense.amount)}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {expense.status || 'pending'}
        </span>
        {!isReadOnly && (
          <button onClick={handleDelete} className="p-1 text-red-500 hover:bg-red-50 rounded-md ml-2" title="Delete expense">
            <Trash className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
