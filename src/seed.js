import { supabase } from './lib/supabase.js';
import { initialData } from './data/initialData.js';

async function seedDatabase() {
  console.log("Starting DB seed...");

  // 1. Insert Installment Expenses
  const { error: errInstallments } = await supabase
    .from('installment_expenses')
    .insert(initialData.installmentExpenses);
  if (errInstallments) console.error("Error installments:", errInstallments);

  // 2. Insert One-Time Expenses
  const { error: errOneTime } = await supabase
    .from('one_time_expenses')
    .insert(initialData.oneTimeExpenses);
  if (errOneTime) console.error("Error one-time:", errOneTime);

  // 3. Insert Monthly History (Using JS stringify to ensure JSONB is passed safely depending on Supabase client setup)
  const historyInserts = initialData.timeline.map((item, index) => {
    // Generate a sort_date to keep it cronological (fake dates just for preserving order)
    const monthIndex = (12 - initialData.timeline.length) + index + 1;
    const paddedMonth = monthIndex.toString().padStart(2, '0');
    const sortDateStr = `2026-${paddedMonth}-01`;

    return {
      month: item.month,
      total_amount: item.total_amount,
      details: item.details, // Native JSON mapping
      sort_date: sortDateStr
    };
  });

  const { error: errHistory } = await supabase
    .from('monthly_history')
    .insert(historyInserts);
    
  if (errHistory) console.error("Error monthly history:", errHistory);

  console.log("Database seeded successfully!");
}

seedDatabase();
