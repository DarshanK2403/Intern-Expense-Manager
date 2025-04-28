// src/utils/pdf.util.js

const PdfPrinter = require("pdfmake/src/printer");
const fs = require("fs");
const path = require("path");

class PDFGenerator {
  constructor() {
    this.fonts = {
      Roboto: {
        normal: path.join(__dirname, "..", "fonts", "TextaRegular.ttf"),
        bold: path.join(__dirname,".." ,"fonts", "TextaBold.ttf"),
        italics: path.join(__dirname,"..","fonts","TextaLight.ttf"),
        bolditalics: path.join(__dirname,"..","fonts","TextaHeavy.ttf")
      }
    };
    this.printer = new PdfPrinter(this.fonts);
  }

  generateExpensePDF(expenseData) {
    const docDefinition = {
      content: [
        {
          text: "Expense Report",
          style: "header",
        },
        {
          columns: [
            [{ text: "Date", style: "subheader" }, { text: expenseData.date }],
            [
              { text: "Category", style: "subheader" },
              { text: expenseData.category },
            ],
            [
              { text: "Amount", style: "subheader" },
              { text: `$${expenseData.amount}` },
            ],
            [
              { text: "Description", style: "subheader" },
              { text: expenseData.description },
            ],
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateIncomePDF(incomeData) {
    const docDefinition = {
      content: [
        {
          text: "Income Report",
          style: "header",
        },
        {
          columns: [
            [{ text: "Date", style: "subheader" }, { text: incomeData.date }],
            [
              { text: "Source", style: "subheader" },
              { text: incomeData.source },
            ],
            [
              { text: "Amount", style: "subheader" },
              { text: `$${incomeData.amount}` },
            ],
            [
              { text: "Description", style: "subheader" },
              { text: incomeData.description },
            ],
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateVendorPDF(vendorData) {
    const docDefinition = {
      content: [
        {
          text: "Vendor Information",
          style: "header",
        },
        {
          columns: [
            [
              { text: "Vendor Name", style: "subheader" },
              { text: vendorData.name },
            ],
            [
              { text: "Contact Person", style: "subheader" },
              { text: vendorData.contactPerson },
            ],
            [{ text: "Email", style: "subheader" }, { text: vendorData.email }],
            [{ text: "Phone", style: "subheader" }, { text: vendorData.phone }],
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateReportPDF(reportData) {
    const docDefinition = {
      content: [
        {
          text: "General Report",
          style: "header",
        },
        {
          columns: [
            [
              { text: "Report Date", style: "subheader" },
              { text: reportData.date },
            ],
            [
              { text: "Report Type", style: "subheader" },
              { text: reportData.type },
            ],
            [
              { text: "Total Amount", style: "subheader" },
              { text: `$${reportData.totalAmount}` },
            ],
            [
              { text: "Description", style: "subheader" },
              { text: reportData.description },
            ],
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFGenerator;