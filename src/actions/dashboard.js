'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

function toValidDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function getMonthInfo(value) {
  const date = toValidDate(value);
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  return {
    month: monthFormatter.format(monthStart).replace(' ', '/'),
    sort_date: monthStart.toISOString().split('T')[0],
  };
}

function parseDetails(details) {
  if (!details) return [];
  if (Array.isArray(details)) return details;
  if (typeof details === 'string') {
    try {
      const parsed = JSON.parse(details);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
}

function isOneTimeHistoryDetail(detail) {
  if (!detail) return false;
  if (detail.kind === 'one-time') return true;
  const name = String(detail.name || '');
  return !name.includes('(') && !name.includes('/') && typeof detail.amount === 'number';
}

async function syncOneTimeExpensesForHistory(historyRecord, newStatus) {
  if (!historyRecord) return;

  const details = parseDetails(historyRecord.details);
  const oneTimeDetails = details.filter(isOneTimeHistoryDetail);
  if (oneTimeDetails.length === 0) return;

  const { data: oneTimeExpenses } = await supabase
    .from('one_time_expenses')
    .select('*')
    .eq('dashboard_id', historyRecord.dashboard_id);

  const matchingExpenses = (oneTimeExpenses || []).filter((expense) =>
    oneTimeDetails.some((detail) => detail.name === expense.name && Number(detail.amount) === Number(expense.amount))
  );

  for (const expense of matchingExpenses) {
    const { error } = await supabase
      .from('one_time_expenses')
      .update({ status: newStatus })
      .eq('id', expense.id);
    if (error) throw new Error(error.message);
  }

  const updatedDetails = details.map((detail) => {
    if (!isOneTimeHistoryDetail(detail)) return detail;
    return { ...detail, status: newStatus };
  });

  const totalAmount = updatedDetails.reduce((sum, item) => {
    if (item.includeInTotal === false) return sum;
    return sum + (Number(item.amount) || 0);
  }, 0);

  const { error } = await supabase
    .from('monthly_history')
    .update({
      details: updatedDetails,
      total_amount: totalAmount,
      status: newStatus,
    })
    .eq('id', historyRecord.id);
  if (error) throw new Error(error.message);
}

async function upsertMonthlyHistoryDetail(dashboardId, monthInfo, detail, options = {}) {
  const { data: currentHistory } = await supabase
    .from('monthly_history')
    .select('*')
    .eq('month', monthInfo.month)
    .eq('dashboard_id', dashboardId)
    .single();

  const details = parseDetails(currentHistory?.details);
  const existingIndex = details.findIndex((item) => item.name === detail.name);

  if (existingIndex >= 0) {
    details[existingIndex] = detail;
  } else {
    details.push(detail);
  }

  const totalAmount = details.reduce((sum, item) => {
    if (item.includeInTotal === false) return sum;
    return sum + (Number(item.amount) || 0);
  }, 0);
  const nextStatus = options.status === 'pending' ? 'pending' : (currentHistory?.status || options.status || 'paid');

  if (currentHistory) {
    const { error } = await supabase
      .from('monthly_history')
      .update({
        total_amount: totalAmount,
        details,
        status: nextStatus,
      })
      .eq('id', currentHistory.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase
    .from('monthly_history')
    .insert([{ dashboard_id: dashboardId, month: monthInfo.month, total_amount: totalAmount, details, status: nextStatus, sort_date: monthInfo.sort_date }]);
  if (error) throw new Error(error.message);
}

async function removeMonthlyHistoryDetail(dashboardId, monthInfo, detailName) {
  const { data: currentHistory } = await supabase
    .from('monthly_history')
    .select('*')
    .eq('month', monthInfo.month)
    .eq('dashboard_id', dashboardId)
    .single();

  if (!currentHistory) return;

  const details = parseDetails(currentHistory.details).filter((item) => item.name !== detailName);

  if (details.length === 0) {
    const { error } = await supabase.from('monthly_history').delete().eq('id', currentHistory.id);
    if (error) throw new Error(error.message);
    return;
  }

  const totalAmount = details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const { error } = await supabase
    .from('monthly_history')
    .update({ total_amount: totalAmount, details })
    .eq('id', currentHistory.id);
  if (error) throw new Error(error.message);
}

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
export async function addOneTimeExpense(dashboardId, expense) {
  const { data, error } = await supabase
    .from('one_time_expenses')
    .insert([{
      dashboard_id: dashboardId,
      name: expense.name,
      amount: expense.amount,
      status: expense.status || 'pending',
    }])
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const monthInfo = getMonthInfo(data.status === 'paid' ? data.created_at : new Date());
  await upsertMonthlyHistoryDetail(
    dashboardId,
    monthInfo,
    { name: data.name, amount: data.amount, status: data.status, includeInTotal: data.status !== 'paid', kind: 'one-time' },
    { status: data.status, countInTotal: data.status !== 'paid' },
  );

  revalidatePath('/');
  return data;
}

// 4. Add Installment Expense
export async function addInstallmentExpense(dashboardId, expense) {
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
  const { data: expense, error: fetchError } = await supabase
    .from('one_time_expenses')
    .select('id, dashboard_id, name, amount, status, created_at')
    .eq('id', expenseId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from('one_time_expenses').update({ status: newStatus }).eq('id', expenseId);
  if (error) throw new Error(error.message);

  const createdMonth = getMonthInfo(expense.created_at);
  const currentMonth = getMonthInfo(new Date());
  const sourceMonth = currentStatus === 'paid' ? createdMonth : currentMonth;
  const targetMonth = newStatus === 'paid' ? createdMonth : currentMonth;

  await removeMonthlyHistoryDetail(expense.dashboard_id, sourceMonth, expense.name);
  await upsertMonthlyHistoryDetail(
    expense.dashboard_id,
    targetMonth,
    { name: expense.name, amount: expense.amount, status: newStatus, includeInTotal: newStatus !== 'paid', kind: 'one-time' },
    { status: newStatus, countInTotal: newStatus !== 'paid' },
  );

  revalidatePath('/');
}

export async function incrementInstallment(expenseId, currentPaid, totalInstallments) {
  if (!supabase) return;
  const newPaid = currentPaid + 1;
  if (newPaid > totalInstallments) return;

  const { data: expense, error: fetchError } = await supabase
    .from('installment_expenses')
    .select('id, dashboard_id, name, installment_amount, installments, paid_installments, created_at')
    .eq('id', expenseId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from('installment_expenses').update({ paid_installments: newPaid }).eq('id', expenseId);
  if (error) throw new Error(error.message);

  const monthInfo = getMonthInfo(new Date());
  await upsertMonthlyHistoryDetail(
    expense.dashboard_id,
    monthInfo,
    { name: `${expense.name} (${newPaid}/${expense.installments})`, amount: expense.installment_amount, status: 'paid', includeInTotal: true, kind: 'installment' },
    { status: 'paid', countInTotal: true },
  );

  revalidatePath('/');
}

export async function toggleMonthlyHistoryStatus(historyId, currentStatus) {
  if (!supabase) return;
  const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
  const { data: historyRecord, error: fetchError } = await supabase
    .from('monthly_history')
    .select('*')
    .eq('id', historyId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  await syncOneTimeExpensesForHistory(historyRecord, newStatus);
  revalidatePath('/');
}

// 6. Deletion Operations
export async function deleteOneTimeExpense(expenseId) {
  if (!supabase) return;
  const { error } = await supabase.from('one_time_expenses').delete().eq('id', expenseId);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return true;
}

export async function deleteInstallmentExpense(expenseId) {
  if (!supabase) return;
  const { error } = await supabase.from('installment_expenses').delete().eq('id', expenseId);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return true;
}
