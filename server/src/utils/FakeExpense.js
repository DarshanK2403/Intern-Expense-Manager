const { faker } = require("@faker-js/faker");

const generateFakeData = (
  userId,
  expenseCategories,
  incomeCategories,
  paymentMethods,
  vendors,
  count = 20,
  options = {}
) => {
  const { month = new Date().getMonth(), year = new Date().getFullYear() } =
    options;

  const allFakeData = Array.from({ length: count }).map(() => {
    const randomDay = faker.number.int({ min: 1, max: 28 });
    const date = new Date(year, month - 1, randomDay); // month should be 0-indexed for JS Date

    const isExpense = faker.helpers.arrayElement([true, false]);
    const randomPayment = faker.helpers.arrayElement(paymentMethods);

    if (isExpense && expenseCategories.length && vendors.length) {
      const randomCategory = faker.helpers.arrayElement(expenseCategories);
      const randomVendor = faker.helpers.arrayElement(vendors);

      return {
        userId,
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        amount: Number(faker.finance.amount(100, 5000, 2)),
        expenseDate: date,
        category: randomCategory._id,
        paymentThrough: randomPayment._id,
        vendor: randomVendor._id,
      };
    } else if (incomeCategories.length) {
      const randomCategory = faker.helpers.arrayElement(incomeCategories);

      return {
        userId,
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        amount: Number(faker.finance.amount(100, 5000, 2)),
        incomeDate: date,
        category: randomCategory._id,
        paymentThrough: randomPayment._id,
        notes: faker.company.name(),
      };
    } else {
      return null; // fallback if no data available
    }
  });

  // Filter out null values (e.g., if no categories)
  return allFakeData.filter(Boolean);
};

module.exports = generateFakeData;
