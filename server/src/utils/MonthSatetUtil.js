const getMonthStats = (data) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const current = data.find(
    (item) => item.month === currentMonth && item.year === currentYear
  );
  const previous = data.find(
    (item) => item.month === lastMonth && item.year === lastMonthYear
  );

  const currentExpense = current?.totalExpense || 0;
  const previousExpense = previous?.totalExpense || 0;

  const currentIncome = current?.totalIncome || 0;
  const previousIncome = previous?.totalIncome || 0;

  const expenseDiff =
    previousExpense > 0
      ? ((currentExpense - previousExpense) / previousExpense) * 100
      : 0;

  const incomeDiff =
    previousIncome > 0
      ? ((currentIncome - previousIncome) / previousIncome) * 100
      : 0;

  return {
    currentExpense,
    previousExpense,
    expenseTrend: `${expenseDiff >= 0 ? "↑" : "↓"} ${Math.abs(
      expenseDiff.toFixed(2)
    )}% from last month`,

    currentIncome,
    previousIncome,
    incomeTrend: `${incomeDiff >= 0 ? "↑" : "↓"} ${Math.abs(
      incomeDiff.toFixed(2)
    )}% from last month`,
  };
};
