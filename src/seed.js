import { supabase } from './lib/supabase.js';
import { initialData } from './data/initialData.js';

function toHistoryDetail(item, month, monthStatus) {
  const name = String(item.name || '');
  const installmentMatch = name.match(/^(.*)\s\((\d+)\/(\d+)\)$/);

  if (installmentMatch) {
    const [, baseName, installmentNumber, installmentTotal] = installmentMatch;
    return {
      ...item,
      name,
      kind: 'installment',
      detailKey: `installment:${month}:${baseName}`,
      installmentNumber: Number(installmentNumber),
      installmentTotal: Number(installmentTotal),
      includeInTotal: true,
      status: item.status || monthStatus,
    };
  }

  return {
    ...item,
    kind: 'one-time',
    detailKey: `one-time:${month}:${name}`,
    status: item.status || monthStatus,
    includeInTotal: true,
  };
}

async function seedDatabase() {
  console.log("Starting DB seed...");

  // 0. Get or create a default dashboard
  let dashboardId;
  const { data: dashboards } = await supabase.from('dashboards').select('id').limit(1);
  if (dashboards && dashboards.length > 0) {
    dashboardId = dashboards[0].id;
  } else {
    // Attempt to insert one if needed
    const { data: newDashboard, error: dashErr } = await supabase.from('dashboards').insert({ name: 'Default Dashboard' }).select('id').single();
    if (dashErr) {
      console.log('Error creating dashboard, using default uuid fallback...');
      dashboardId = '00000000-0000-0000-0000-000000000000'; // fallback
    } else {
      dashboardId = newDashboard.id;
    }
  }

  // 1. Insert Installment Expenses
  const { error: errInstallments } = await supabase
    .from('installment_expenses')
    .insert(initialData.installmentExpenses.map(item => ({ ...item, dashboard_id: dashboardId })));
  if (errInstallments) console.error("Error installments:", errInstallments);

  // 2. Insert One-Time Expenses
  const { error: errOneTime } = await supabase
    .from('one_time_expenses')
    .insert(initialData.oneTimeExpenses.map(item => ({ ...item, dashboard_id: dashboardId })));
  if (errOneTime) console.error("Error one-time:", errOneTime);

  const monthMap = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };

  // 3. Insert Monthly History (Using JS stringify to ensure JSONB is passed safely depending on Supabase client setup)
  const historyInserts = initialData.timeline.map((item, index) => {
    // Generate a sort_date from the month string (e.g. "Dec/2025" -> "2025-12-01")
    const [mmm, yyyy] = item.month.split('/');
    const paddedMonth = monthMap[mmm] || '01';
    const sortDateStr = `${yyyy}-${paddedMonth}-01`;
    const normalizedDetails = (item.details || []).map((detail) => toHistoryDetail(detail, item.month, item.status));

    return {
      month: item.month,
      total_amount: item.total_amount,
      details: normalizedDetails, // Native JSON mapping
      status: item.status,
      sort_date: sortDateStr,
      dashboard_id: dashboardId
    };
  });

  const { error: errHistory } = await supabase
    .from('monthly_history')
    .insert(historyInserts);
    
  if (errHistory) console.error("Error monthly history:", errHistory);

  console.log("Database seeded successfully!");
}

seedDatabase();
