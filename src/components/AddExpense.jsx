'use client';

import React, { useState } from 'react';
import { addOneTimeExpense, addInstallmentExpense } from '@/actions/dashboard';
import { PlusCircle, X } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export default function AddExpense({ dashboardId }) {
  const { t, translateMonth } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [expenseType, setExpenseType] = useState('one-time'); // 'one-time' or 'installment'
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [status, setStatus] = useState('pending');
  const [startMonth, setStartMonth] = useState('May/2026');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dashboardId) return alert(t('selectDashboard'));
    setLoading(true);

    try {
      const numAmount = parseFloat(amount.replace(',', '.'));

      if (expenseType === 'one-time') {
        await addOneTimeExpense(dashboardId, {
          name,
          amount: Math.max(0, numAmount),
          status
        });
      } else {
        const numInstallments = parseInt(installments) || 1;
        const totalAmount = Math.max(0, numAmount);
        const installmentAmount = totalAmount / numInstallments;

        await addInstallmentExpense(dashboardId, {
          name,
          total_amount: totalAmount,
          installments: numInstallments,
          paid_installments: 0,
          installment_amount: installmentAmount,
          start_month: startMonth
        });
      }

      // Reset & Close
      setName('');
      setAmount('');
      setInstallments('');
      setStatus('pending');
      setStartMonth('May/2026');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          {t('addNewExpense')}
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t('addNewExpense')}</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setExpenseType('one-time')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${expenseType === 'one-time' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t('oneTime')}
            </button>
            <button
              onClick={() => setExpenseType('installment')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${expenseType === 'installment' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t('installment')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('expenseName')}</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grocery Shopping"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {expenseType === 'installment' ? t('totalAmount') : t('amount')}
              </label>
              <input 
                required
                type="number"
                step="0.01" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
              />
            </div>

            {expenseType === 'installment' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('installments')}</label>
                <input 
                  required
                  type="number"
                  min="2"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                />
              </div>
            )}

            {expenseType === 'installment' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('startMonthLabel')}</label>
                <select 
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 bg-white"
                >
                  <option value="Dec/2025">{translateMonth("Dec/2025")}</option>
                  <option value="Jan/2026">{translateMonth("Jan/2026")}</option>
                  <option value="Feb/2026">{translateMonth("Feb/2026")}</option>
                  <option value="Mar/2026">{translateMonth("Mar/2026")}</option>
                  <option value="Apr/2026">{translateMonth("Apr/2026")}</option>
                  <option value="May/2026">{translateMonth("May/2026")}</option>
                  <option value="Jun/2026">{translateMonth("Jun/2026")}</option>
                  <option value="Jul/2026">{translateMonth("Jul/2026")}</option>
                  <option value="Aug/2026">{translateMonth("Aug/2026")}</option>
                  <option value="Sep/2026">{translateMonth("Sep/2026")}</option>
                  <option value="Oct/2026">{translateMonth("Oct/2026")}</option>
                  <option value="Nov/2026">{translateMonth("Nov/2026")}</option>
                </select>
              </div>
            )}

            {expenseType === 'one-time' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('status')}</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 bg-white"
                >
                  <option value="pending">{t('pending')}</option>
                  <option value="paid">{t('paid')}</option>
                </select>
              </div>
            )}

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? '...' : t('saveExpense')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
