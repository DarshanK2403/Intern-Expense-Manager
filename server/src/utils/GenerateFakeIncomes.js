const { faker } = require("@faker-js/faker");

const generateFakeIncomes = (userId, count = 20, options = {}) => {
  const categories = ["Salary", "Freelance", "Investments", "Bonus", "Rental"];
  const {
    month = new Date().getMonth(), // 0 = Jan
    year = new Date().getFullYear(),
  } = options;

  const incomes = Array.from({ length: count }).map(() => {
    const randomDay = faker.number.int({ min: 1, max: 28 });
    const incomeDate = new Date(year, month, randomDay);

    return {
      userId,
      title: faker.company.catchPhrase(),
      amount: Number(faker.finance.amount(1000, 20000, 2)),
      incomeDate,
      category: faker.helpers.arrayElement(categories),
      notes: faker.lorem.sentence(),
    };
  });

  return incomes;
};

module.exports = generateFakeIncomes;
