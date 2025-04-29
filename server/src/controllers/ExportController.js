const PDFGenerator = require("../utils/PDFGenerator");

const pdfGenerator = new PDFGenerator();

const generateExpensePDF = async (req, res) => {
  try {
    const { expenseData, userData, fields } = req.body;

    const pdfBuffer = await pdfGenerator.generateExpensePDF(
      expenseData,
      userData,
      fields
    );

    // Set headers to serve the PDF file as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expense-report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the generated PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating expense PDF:", error);
    res.status(500).json({ message: "Failed to generate expense PDF" });
  }
};

const generateIncomePDF = async (req, res) => {
  try {
    const incomeData = req.body;
    const pdfBuffer = await pdfGenerator.generateIncomePDF(incomeData);

    // Set headers to serve the PDF file as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=income-report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the generated PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating income PDF:", error);
    res.status(500).json({ message: "Failed to generate income PDF" });
  }
};

const generateVendorPDF = async (req, res) => {
  try {
    const vendorData = req.body;
    const pdfBuffer = await pdfGenerator.generateVendorPDF(vendorData);

    // Set headers to serve the PDF file as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=vendor-report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the generated PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating vendor PDF:", error);
    res.status(500).json({ message: "Failed to generate vendor PDF" });
  }
};

const generateReportPDF = async (req, res) => {
  try {
    const reportData = req.body;
    const pdfBuffer = await pdfGenerator.generateReportPDF(reportData);

    // Set headers to serve the PDF file as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=general-report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the generated PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating general report PDF:", error);
    res.status(500).json({ message: "Failed to generate general report PDF" });
  }
};

module.exports = {
  generateExpensePDF,
  generateIncomePDF,
  generateVendorPDF,
  generateReportPDF,
};
