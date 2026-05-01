'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// 0. Dashboards logic
export async function getDashboards() {
  if (!supabase) return [];
  const { data } = await supabase.from('dashboards').select('*').order('created_at', { ascending: true });
  return data || [];
}

export async function createDashboard(name) {
  const { data, error } = await supabase.from('dashboards').insert([{ name }]).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

export async function getDashboardData(dashboardId) {
  if (!supabase || !dashboardId) return { summary: { totalCurrentMonth: 0 }, installmentExpenses: [], oneTimeExpenses: [], timeline: [] };

  const { data: installmentExpenses } = await supabase.from('installment_expenses').select('*').eq('dashboard_id', dashboardId);
  const { data: oneTimeExpenses } = await supabase.from('one_time_expenses').select('*').eq('dashboard_id', dashboardId);
  const { data: monthlyHistory } = await supabase.from('monthly_history').select('*').eq('dashboard_id', dashboardId).order('sort_date', { ascending: false });

  const summary = { totalCurrentMonth: monthlyHistory?.[0]?.total_amount || 0 };

  return {
    summary,
    installmentExpenses: installmentExpenses || [],
    oneTimeExpenses: oneTimeExpenses || [],
    timeline: monthlyHistory || [],
  };
}

// 2. Add One-Time Expense
export async function addOneTimeExpense(expense, dashboardId) {
  const { data, error } = await supabase
    .from('one_time_expenses')
    .insert([{
      dashboard_id: dashboardId,
      name: expense.name,
      amount: expense.amount,
      status: expense.status || 'pending',
    }])
    .select();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

// 4. Add Installment Expense
export async function addInstallmentExpense(expense, dashboardId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('installment_expenses')
    .insert([{
      dashboard_id: dashboardId,
      name: expense.name,
      total_amount: expense.total_amount,
      installments: expense.installments,
      paid_installments: expense.paid_installments || 0,
      installment_amount: expense.installment_amount,
    }])
    .select();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

// 3. Update Installment and Monthly History
export async function updateInstallment(expenseId, newPaidAmount, currentMonth, newHistoryData, dashboardId) {
  const { error: errInstallment } = await supabase
    .from('installment_expenses')
    .update({ paid_installments: newPaidAmount })
    .eq('id', expenseId);

  if (errInstallment) throw new Error(errInstallment.message);

  const { data: currentHistory } = await supabase
    .from('monthly_history')
    .select('*')
    .eq('month', currentMonth)
    .eq('dashboard_id', dashboardId)
    .single();

  if (currentHistory) {
    const { error: errHist } = await supabase
      .from('monthly_history')
      .update({
         total_amount: newHistoryData.total_amount,
         details: newHistoryData.details
      })
      .eq('id', currentHistory.id);
    if (errHist) throw new Error(errHist.message);
  } else {
    const { error: errHist } = await supabase
      .from('monthly_history')
      .insert([{
         dashboard_id: dashboardId,
         month: currentMonth,
         total_amount: newHistoryData.total_amount,
         details: newHistoryData.details,
         sort_date: new Date().toISOString().split('T')[0]
      }]);
    if (errHist) throw new Error(errHist.message);
  }
  revalidatePath('/');
  return true;
}

// 5. Status Operations
export async function toggleOneTimeExpenseStatus(expenseId, currentStatus) {
  if (!supabase) return;
  const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
  await supabase.from('one_time_expenses').update({ status: newStatus }).eq('id', expenseId);
  revalidatePath('/');
}

export async function incrementInstallment(expenseId, currentPaid, totalInstallments) {
  if (!supabase) return;
  const newPaid = currentPaid + 1;
  if (newPaid > totalInstallments) return;
  await supabase.from('installment_expenses').update({ paid_installments: newPaid }).eq('id', expenseId);
  revalidatePath('/');
}

export async function toggleMonthlyHistoryStatus(historyId, currentStatus) {
  if (!supabase) return;
  const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
  await supabase.from('monthly_history').update({ status: newStatus }).eq('id', historyId);
  revalidatePath('/');
}
