const { faker } = require("@faker-js/faker");

const generateFakeExpenses = (userId, count = 20, options = {}) => {
  const categories = ["Food", "Travel", "Utilities", "Entertainment", "Medical"];
  const paymentMethods = ["Cash", "Credit Card", "UPI", "Bank Transfer"];

  const {
    month = new Date().getMonth(), // 0 = Jan, 11 = Dec
    year = new Date().getFullYear(),
  } = options;

  const expenses = Array.from({ length: count }).map(() => {
    const randomDay = faker.number.int({ min: 1, max: 28 }); // safe for all months
    const expenseDate = new Date(year, month, randomDay);

    return {
      userId,
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      amount: Number(faker.finance.amount(100, 5000, 2)).toFixed(2),
      expenseDate,
      category: faker.helpers.arrayElement(categories),
      paymentThrough: faker.helpers.arrayElement(paymentMethods),
      vendor: faker.company.name(),
    };
  });

  return expenses;
};

module.exports = generateFakeExpenses;
