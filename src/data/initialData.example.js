export const initialData = {
  summary: { totalCurrentMonth: 120.00 },
  installmentExpenses: [
    {
      name: "New Laptop",
      total_amount: 1200.00,
      installments: 12,
      paid_installments: 2,
      installment_amount: 100.00,
      start_month: "Jan/2026",
    }
  ],
  oneTimeExpenses: [
    { name: "Groceries", amount: 120.0, status: "paid" },
    { name: "Coffee", amount: 15.0, status: "pending" },
  ],
  timeline: [
    {
      month: "Jan/2026",
      total_amount: 220.00,
      status: "paid",
      details: [
        { name: "New Laptop (1/12)", amount: 100.00 },
        { name: "Groceries", amount: 120.00 },
      ],
    },
    {
      month: "Feb/2026",
      total_amount: 100.00,
      status: "paid",
      details: [
        { name: "New Laptop (2/12)", amount: 100.00 },
      ],
    },
    {
      month: "Mar/2026",
      total_amount: 115.00,
      status: "pending",
      details: [
        { name: "New Laptop (3/12)", amount: 100.00 },
        { name: "Coffee", amount: 15.00, status: "pending" },
      ],
    },
  ],
};

// Calculate summary total dynamically for mock data based on the first pending month
const pendingMonth = initialData.timeline.find(m => m.status === 'pending');
if (pendingMonth) {
  initialData.summary.totalCurrentMonth = pendingMonth.total_amount;
} else if (initialData.timeline.length > 0) {
  initialData.summary.totalCurrentMonth = initialData.timeline[initialData.timeline.length - 1].total_amount;
}