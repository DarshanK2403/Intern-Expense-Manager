const { faker } = require("@faker-js/faker");

const generateFakeData = (
  userId,
  expenseCategories,
  incomeCategories,
  paymentMethods,
  count = 20,
  options = {}
) => {
  const { month = new Date().getMonth(), year = new Date().getFullYear() } = options;

  const allFakeData = Array.from({ length: count }).map(() => {
    const randomDay = faker.number.int({ min: 1, max: 28 });
    const date = new Date(year, month, randomDay);

    const isExpense = faker.helpers.arrayElement([true, false]);

    const randomPayment = faker.helpers.arrayElement(paymentMethods);

    if (isExpense) {
      const randomCategory = faker.helpers.arrayElement(expenseCategories);

      return {
        userId,
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        amount: Number(faker.finance.amount(100, 5000, 2)).toFixed(2),
        expenseDate: date,
        category: randomCategory._id,
        paymentThrough: randomPayment._id,
        vendor: faker.company.name(),
      };
    } else {
      const randomCategory = faker.helpers.arrayElement(incomeCategories);

      return {
        userId,
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        amount: Number(faker.finance.amount(100, 5000, 2)).toFixed(2),
        incomeDate: date,
        category: randomCategory._id, 
        paymentThrough: randomPayment._id, 
        notes: faker.company.name(),
      };
    }
  });

  return allFakeData;
};

module.exports = generateFakeData;
