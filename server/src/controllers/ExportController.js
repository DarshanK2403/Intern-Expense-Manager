const Expense = require("../models/ExpenseModel");
const Income = require("../models/IncomeModel");
const path = require("path");
const PdfPrinter = require("pdfmake");
const moment = require("moment");
require("pdfmake/build/vfs_fonts");

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "..", "fonts", "TextaRegular.ttf"),
    bold: path.join(__dirname, "..", "fonts", "TextaBold.ttf"),
    italics: path.join(__dirname, "..", "fonts", "TextaThin.ttf"),
    bolditalics: path.join(__dirname, "..", "fonts", "TextaHeavyIt.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

const generatePDF = (res, title, data, type) => {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      label: { bold: true, fontSize: 10 },
      value: { fontSize: 10 },
      tableHeader: { bold: true, fillColor: "#f1f1f1", fontSize: 10 },
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  data.forEach((expense, index) => {
    const date = moment(expense.date || expense.expenseDate).format(
      "MMMM D, YYYY"
    );
    if (index > 0) {
      docDefinition.content.push({ text: "", pageBreak: "before" });
    }

    docDefinition.content.push(
      { text: "EXPENSE TRACKER", style: "header" },
      { text: "Expense Receipt", style: "subheader" },

      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "Title:", style: "label" },
              { text: expense.title || "N/A", style: "value" },

              { text: "Category:", style: "label", margin: [0, 10, 0, 0] },
              {
                text: expense.category || "N/A",
                style: "value",
              },

              {
                text: "Payment Method:",
                style: "label",
                margin: [0, 10, 0, 0],
              },
              { text: expense.paymentThrough || "N/A", style: "value" },

              { text: "Date:", style: "label", margin: [0, 10, 0, 0] },
              { text: date, style: "value" },
            ],
          },
          {
            width: "40%",
            stack: [
              { text: "Vendor Details", style: "subheader" },
              { text: "Vendor Name:", style: "label" },
              { text: expense.vendor || "N/A", style: "value" },
            ],
          },
        ],
        columnGap: 20,
      },

      { text: "Description", style: "subheader", margin: [0, 20, 0, 5] },
      {
        text: expense.description || "No description provided",
        style: "value",
      },

      { text: "Expense Summary", style: "subheader", margin: [0, 20, 0, 10] },
      {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              { text: "Category", style: "tableHeader" },
              { text: "Payment Method", style: "tableHeader" },
              { text: "Amount", style: "tableHeader" },
            ],
            [
              expense.category || "N/A",
              expense.paymentThrough || "N/A",
              `$${parseFloat(expense.amount || 0).toFixed(2)}`,
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },

      {
        text: `\nGenerated on ${moment().format("MMMM D, YYYY")}}`,
        style: "value",
        alignment: "center",
        margin: [0, 30, 0, 0],
      }
    );
  });

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}_report.pdf`
  );
  pdfDoc.pipe(res);
  pdfDoc.end();
};

const exportExpensePDF = async (req, res) => {
  try {
    // Get the expense data from req.body
    const expenseData = req.body;

    // Check if the expense data is valid
    if (
      !expenseData ||
      !Array.isArray(expenseData) ||
      expenseData.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "No valid expense data provided" });
        
    }

    // Format the expense data as needed
    const formatted = expenseData.map((e) => ({
      title: e.title,
      amount: e.amount,
      date: e.expenseDate,
      category: e.category || "N/A",
      paymentThrough: e.paymentThrough || "N/A",
      vendor: e.vendor || "N/A",
      description: e.description || "N/A",
    }));

    // Generate the PDF with the formatted data
    generatePDF(res, "Expense Report", formatted, "expense");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate expense PDF" });
  }
};

const exportIncomePDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const incomes = await Income.find({ userId }).populate("category");
    const formatted = incomes.map((i) => ({ ...i._doc, date: i.incomeDate }));
    generatePDF(res, "Income Report", formatted, "income");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate income PDF" });
  }
};

const exportCustomReportPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user._id;

    const expenses = await Expense.find({
      userId,
      expenseDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("category");

    const incomes = await Income.find({
      userId,
      incomeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("category");

    const allData = [
      ...expenses.map((e) => ({
        ...e._doc,
        date: e.expenseDate,
        type: "Expense",
      })),
      ...incomes.map((i) => ({
        ...i._doc,
        date: i.incomeDate,
        type: "Income",
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=custom_report.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Custom Financial Report", { align: "center" });
    doc.moveDown();

    allData.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. [${item.type}] ${item.title}\n   Amount: ₹${
            item.amount
          }\n   Category: ${item.category?.name || "N/A"}\n   Date: ${moment(
            item.date
          ).format("YYYY-MM-DD")}`,
          { lineGap: 6 }
        );
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate custom report PDF" });
  }
};

module.exports = {
  exportExpensePDF,
  exportIncomePDF,
  exportCustomReportPDF,
};
