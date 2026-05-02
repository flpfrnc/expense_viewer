import { supabase } from './lib/supabase.js';

async function cleanupDatabase() {
  console.log("Starting cleanup of duplicate records...");

  if (!supabase) {
    console.error("Supabase not initialized. Check your .env.local file.");
    process.exit(1);
  }

  try {
    // 1. Get dashboard ID
    const { data: dashboards } = await supabase.from('dashboards').select('id').limit(1);
    if (!dashboards || dashboards.length === 0) {
      console.log("No dashboards found. Nothing to clean.");
      return;
    }
    const dashboardId = dashboards[0].id;

    // 2. Delete all installment_expenses
    const { error: errInstall } = await supabase
      .from('installment_expenses')
      .delete()
      .eq('dashboard_id', dashboardId);
    if (errInstall) console.error("Error deleting installments:", errInstall);
    else console.log("✓ Deleted all installment_expenses");

    // 3. Delete all one_time_expenses
    const { error: errOneTime } = await supabase
      .from('one_time_expenses')
      .delete()
      .eq('dashboard_id', dashboardId);
    if (errOneTime) console.error("Error deleting one-time:", errOneTime);
    else console.log("✓ Deleted all one_time_expenses");

    // 4. Delete all monthly_history
    const { error: errHistory } = await supabase
      .from('monthly_history')
      .delete()
      .eq('dashboard_id', dashboardId);
    if (errHistory) console.error("Error deleting history:", errHistory);
    else console.log("✓ Deleted all monthly_history");

    console.log("✓ Cleanup completed successfully! You can now run seed.js");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

cleanupDatabase();
