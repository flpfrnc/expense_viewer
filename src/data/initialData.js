export const initialData = {
  summary: { totalCurrentMonth: 961.85 },
  installmentExpenses: [
    {
      name: "Mecânico",
      total_amount: 3626.20,
      installments: 10,
      paid_installments: 5,
      installment_amount: 362.62,
      start_month: "Dec/2025",
    },
    {
      name: "Serviço Extra",
      total_amount: 432.00,
      installments: 12,
      paid_installments: 2,
      installment_amount: 36.00,
      start_month: "Mar/2026",
    },
    {
      name: "Calça Emanuel",
      total_amount: 201.00,
      installments: 3,
      paid_installments: 1,
      installment_amount: 67.00,
      start_month: "Apr/2026",
    },
    {
      name: "Reparo Motor Carro",
      total_amount: 538.32,
      installments: 2,
      paid_installments: 1,
      installment_amount: 269.16,
      start_month: "Apr/2026",
    },
    {
      name: "Passagem Aérea",
      total_amount: 1303.35,
      installments: 6,
      paid_installments: 0,
      installment_amount: 217.22,
      start_month: "May/2026",
    },
  ],
  oneTimeExpenses: [
    { name: "Última Parcela Riachuelo", amount: 83.0, status: "paid" },
    { name: "Pix Extra", amount: 168.0, status: "paid" },
    { name: "Retorno Uber", amount: 36.0, status: "paid" },
    { name: "Teste", amount: 10.0, status: "pending" },
  ],
  timeline: [
    {
      month: "Dec/2025",
      total_amount: 362.62,
      status: "paid",
      details: [{ name: "Mecânico (1/10)", amount: 362.62 }],
    },
    {
      month: "Jan/2026",
      total_amount: 613.62,
      status: "paid",
      details: [
        { name: "Mecânico (2/10)", amount: 362.62 },
        { name: "Última Parcela Riachuelo", amount: 83.0 },
        { name: "Pix Extra", amount: 168.0 },
      ],
    },
    {
      month: "Feb/2026",
      total_amount: 362.62,
      status: "paid",
      details: [{ name: "Mecânico (3/10)", amount: 362.62 }],
    },
    {
      month: "Mar/2026",
      total_amount: 434.62,
      status: "paid",
      details: [
        { name: "Mecânico (4/10)", amount: 362.62 },
        { name: "Serviço Extra (1/12)", amount: 36.0 },
        { name: "Retorno Uber", amount: 36.0 },
      ],
    },
    {
      month: "Apr/2026",
      total_amount: 734.78,
      status: "paid",
      details: [
        { name: "Mecânico (5/10)", amount: 362.62 },
        { name: "Reparo Motor Carro (1/2)", amount: 269.16 },
        { name: "Calça Emanuel (1/3)", amount: 67.0 },
        { name: "Serviço Extra (2/12)", amount: 36.0 },
      ],
    },
    {
      month: "May/2026",
      total_amount: 962.00,
      status: "pending",
      details: [
        { name: "Mecânico (6/10)", amount: 362.62 },
        { name: "Reparo Motor Carro (2/2)", amount: 269.16 },
        { name: "Passagem Aérea (1/6)", amount: 217.22 },
        { name: "Calça Emanuel (2/3)", amount: 67.0 },
        { name: "Serviço Extra (3/12)", amount: 36.0 },
        { name: "Teste", amount: 10.0, status: "pending" },
      ],
    },
    {
      month: "Jun/2026",
      total_amount: 682.84,
      status: "pending",
      details: [
        { name: "Mecânico (7/10)", amount: 362.62 },
        { name: "Passagem Aérea (2/6)", amount: 217.22 },
        { name: "Calça Emanuel (3/3)", amount: 67.0 },
        { name: "Serviço Extra (4/12)", amount: 36.0 },
      ],
    },
    {
      month: "Jul/2026",
      total_amount: 615.84,
      status: "pending",
      details: [
        { name: "Mecânico (8/10)", amount: 362.62 },
        { name: "Passagem Aérea (3/6)", amount: 217.22 },
        { name: "Serviço Extra (5/12)", amount: 36.0 },
      ],
    },
    {
      month: "Aug/2026",
      total_amount: 615.84,
      status: "pending",
      details: [
        { name: "Mecânico (9/10)", amount: 362.62 },
        { name: "Passagem Aérea (4/6)", amount: 217.22 },
        { name: "Serviço Extra (6/12)", amount: 36.0 },
      ],
    },
    {
      month: "Sep/2026",
      total_amount: 615.84,
      status: "pending",
      details: [
        { name: "Mecânico (10/10)", amount: 362.62 },
        { name: "Passagem Aérea (5/6)", amount: 217.22 },
        { name: "Serviço Extra (7/12)", amount: 36.0 },
      ],
    },
    {
      month: "Oct/2026",
      total_amount: 253.22,
      status: "pending",
      details: [
        { name: "Passagem Aérea (6/6)", amount: 217.22 },
        { name: "Serviço Extra (8/12)", amount: 36.0 },
      ],
    },
    {
      month: "Nov/2026",
      total_amount: 36.00,
      status: "pending",
      details: [
        { name: "Serviço Extra (9/12)", amount: 36.00 },
      ],
    },
    {
      month: "Dec/2026",
      total_amount: 36.00,
      status: "pending",
      details: [
        { name: "Serviço Extra (10/12)", amount: 36.00 },
      ],
    },
    {
      month: "Jan/2027",
      total_amount: 36.00,
      status: "pending",
      details: [
        { name: "Serviço Extra (11/12)", amount: 36.00 },
      ],
    },
    {
      month: "Feb/2027",
      total_amount: 36.00,
      status: "pending",
      details: [
        { name: "Serviço Extra (12/12)", amount: 36.00 },
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