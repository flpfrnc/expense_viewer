export const initialData = {
  summary: { totalCurrentMonth: 951.85 },
  installmentExpenses: [
    {
      name: "Main Car",
      total_amount: 3626.20,
      installments: 10,
      paid_installments: 5,
      installment_amount: 362.62,
    },
    {
      name: "Extra Service",
      total_amount: 432.00,
      installments: 12,
      paid_installments: 2,
      installment_amount: 36.00,
    },
    {
      name: "Emanuel Pants",
      total_amount: 201.00,
      installments: 3,
      paid_installments: 1,
      installment_amount: 67.00,
    },
    {
      name: "Car Engine Repair",
      total_amount: 538.32,
      installments: 2,
      paid_installments: 1,
      installment_amount: 269.16,
    },
    {
      name: "Flight Ticket",
      total_amount: 1303.35,
      installments: 6,
      paid_installments: 0,
      installment_amount: 217.22,
    },
  ],
  oneTimeExpenses: [
    { name: "Riachuelo Last Installment", amount: 83.0, status: "paid" },
    { name: "Extra Pix", amount: 168.0, status: "paid" },
    { name: "Uber Return", amount: 36.0, status: "paid" },
  ],
  timeline: [
    {
      month: "Dec/2025",
      total_amount: 362.62,
      status: "paid",
      details: [{ name: "Car (1/10)", amount: 362.62 }],
    },
    {
      month: "Jan/2026",
      total_amount: 613.62,
      status: "paid",
      details: [
        { name: "Car (2/10)", amount: 362.62 },
        { name: "Riachuelo Last Installment", amount: 83.0 },
        { name: "Extra Pix", amount: 168.0 },
      ],
    },
    {
      month: "Feb/2026",
      total_amount: 362.62,
      status: "paid",
      details: [{ name: "Car (3/10)", amount: 362.62 }],
    },
    {
      month: "Mar/2026",
      total_amount: 398.62,
      status: "paid",
      details: [
        { name: "Car (4/10)", amount: 362.62 },
        { name: "Extra Service (1/12)", amount: 36.0 },
      ],
    },
    {
      month: "Apr/2026",
      total_amount: 734.78,
      status: "paid",
      details: [
        { name: "Car (5/10)", amount: 362.62 },
        { name: "Car Engine Repair (1/2)", amount: 269.16 },
        { name: "Emanuel Pants (1/3)", amount: 67.0 },
        { name: "Extra Service (2/12)", amount: 36.0 },
      ],
    },
    {
      month: "May/2026",
      total_amount: 951.85,
      status: "pending",
      details: [
        { name: "Car (6/10)", amount: 362.62 },
        { name: "Car Engine Repair (2/2)", amount: 269.16 },
        { name: "Flight Ticket (1/6)", amount: 217.07 },
        { name: "Emanuel Pants (2/3)", amount: 67.0 },
        { name: "Extra Service (3/12)", amount: 36.0 },
      ],
    },
  ],
};