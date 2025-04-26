const PDFDocument = require('pdfkit');
const moment = require('moment');
const Expense = require('../models/ExpenseModel'); // Adjust as needed
const Income = require('../models/IncomeModel');   // Adjust as needed

const generatePDF = (res, title, data, type) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_report.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();

  data.forEach((item, index) => {
    doc.fontSize(12).text(
      `${index + 1}. Title: ${item.title}\n   Amount: ₹${item.amount}\n   Category: ${item.category.name}\n   Date: ${moment(item.date).format("YYYY-MM-DD")}\n`,
      { lineGap: 6 }
    );
    doc.moveDown();
  });

  doc.end();
};

const exportExpensePDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId }).populate('category');
    generatePDF(res, 'Expense Report', expenses.map(e => ({ ...e._doc, date: e.expenseDate })), 'expense');
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate expense PDF' });
  }
};

const exportIncomePDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const incomes = await Income.find({ userId }).populate('category');
    generatePDF(res, 'Income Report', incomes.map(i => ({ ...i._doc, date: i.incomeDate })), 'income');
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate income PDF' });
  }
};

const exportCustomReportPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user._id;

    const expenses = await Expense.find({
      userId,
      expenseDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('category');

    const incomes = await Income.find({
      userId,
      incomeDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('category');

    const allData = [
      ...expenses.map(e => ({ ...e._doc, date: e.expenseDate, type: 'Expense' })),
      ...incomes.map(i => ({ ...i._doc, date: i.incomeDate, type: 'Income' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=custom_report.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Custom Financial Report', { align: 'center' });
    doc.moveDown();

    allData.forEach((item, index) => {
      doc.fontSize(12).text(
        `${index + 1}. [${item.type}] ${item.title}\n   Amount: ₹${item.amount}\n   Category: ${item.category.name}\n   Date: ${moment(item.date).format("YYYY-MM-DD")}`,
        { lineGap: 6 }
      );
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate custom report PDF' });
  }
};

module.exports = {
    exportExpensePDF,
    exportIncomePDF,
    exportCustomReportPDF,
  };
  