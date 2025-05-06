// src/utils/pdf.util.js
const PdfPrinter = require("pdfmake/src/printer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function fetchImageAsBase64(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const returnedB64 = Buffer.from(response.data, "binary").toString("base64");
  const mimeType = response.headers["content-type"];
  return `data:${mimeType};base64,${returnedB64}`;
}

class PDFGenerator {
  constructor() {
    this.fonts = {
      Roboto: {
        normal: path.join(__dirname, "..", "fonts", "TextaRegular.ttf"),
        bold: path.join(__dirname, "..", "fonts", "TextaBold.ttf"),
        italics: path.join(__dirname, "..", "fonts", "TextaLight.ttf"),
        bolditalics: path.join(__dirname, "..", "fonts", "TextaHeavy.ttf"),
      },
    };
    this.printer = new PdfPrinter(this.fonts);
  }

  generateExpensePDF(expenseData, userData, fields = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let base64Image = null;

        if (expenseData?.receipt && fields.receipt) {
          try {
            base64Image = await fetchImageAsBase64(expenseData?.receipt);
          } catch (error) {
            console.error("Failed to fetch receipt image:", error.message);
          }
        }

        const generatedDate = new Date().toLocaleDateString();
        const hasImage = !!base64Image;

        const content = [];

        // Header
        content.push({
          text: "Expense Receipt",
          style: "mainHeader",
          alignment: "center",
          margin: [0, 0, 0, 30],
        });

        // User Details
        if (fields.userDetails) {
          content.push({
            table: {
              widths: ["25%", "75%"],
              body: [
                [
                  { text: "Name", style: "fieldLabel" },
                  {
                    text:
                      `${userData.firstName || ""} ${
                        userData.lastName || ""
                      }`.trim() || "-",
                    style: "fieldValue",
                  },
                ],
                [
                  { text: "Email", style: "fieldLabel" },
                  { text: userData.email || "-", style: "fieldValue" },
                ],
                [
                  { text: "Phone", style: "fieldLabel" },
                  { text: userData.phone || "-", style: "fieldValue" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) =>
                rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
            margin: [0, 0, 0, 30],
          });
        }

        // Expense Details
        if (fields.expenseDetails) {
          content.push({
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  { text: "Title", style: "fieldLabel" },
                  {
                    text: expenseData.title || "Untitled Expense",
                    style: "fieldValue",
                  },
                ],
                [
                  { text: "Date", style: "fieldLabel" },
                  {
                    text: expenseData.expenseDate
                      ? new Date(expenseData.expenseDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-",
                    style: "fieldValue",
                  },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) =>
                rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
            margin: [0, 0, 0, 20],
          });
        }

        // Expense Summary
        if (fields.expenseSummary) {
          content.push({
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  { text: "Amount", style: "tableHeader" },
                  {
                    text: `$${expenseData.amount?.toFixed(2) || "0.00"}`,
                    style: "amountHighlight",
                  },
                ],
                [
                  { text: "Category", style: "tableHeader" },
                  { text: expenseData.category || "-", style: "tableValue" },
                ],
                [
                  { text: "Payment", style: "tableHeader" },
                  {
                    text: expenseData.paymentThrough || "-",
                    style: "tableValue",
                  },
                ],
                [
                  { text: "Vendor", style: "tableHeader" },
                  { text: expenseData.vendor || "-", style: "tableValue" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#eeeeee" : null),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#cccccc",
              vLineColor: () => "#cccccc",
            },
            margin: [0, 0, 0, 30],
          });
        }

        // Description
        if (fields.description) {
          content.push({
            text: "Description",
            style: "sectionHeader",
            margin: [0, 10, 0, 5],
          });
          content.push({
            text: expenseData.description || "No description provided.",
            style: "descriptionText",
            margin: [0, 0, 0, 30],
          });
        }

        // Receipt Image
        if (fields.receipt && hasImage) {
          content.push({
            pageBreak: "before",
            image: base64Image,
            width: 250,
            alignment: "center",
            margin: [0, 0, 0, 30],
          });
        }

        const docDefinition = {
          content,
          footer:
            fields.footer &&
            ((currentPage, pageCount) => ({
              columns: [
                {
                  text: `Generated on: ${generatedDate}`,
                  style: "footerStyle",
                  alignment: "left",
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  style: "footerStyle",
                  alignment: "right",
                },
              ],
              margin: [40, 0, 40, 30],
            })),
          styles: {
            mainHeader: {
              fontSize: 28,
              bold: true,
              color: "#004080",
              decoration: "underline",
            },
            sectionHeader: {
              fontSize: 18,
              bold: true,
              color: "#003366",
            },
            fieldLabel: {
              fontSize: 11,
              bold: true,
              color: "#555555",
            },
            fieldValue: {
              fontSize: 11,
              color: "#111111",
            },
            tableHeader: {
              fontSize: 11,
              bold: true,
              fillColor: "#d9edf7",
              color: "#31708f",
              margin: [0, 5, 0, 5],
            },
            tableValue: {
              fontSize: 11,
              color: "#333333",
              margin: [0, 5, 0, 5],
            },
            amountHighlight: {
              fontSize: 18,
              bold: true,
              color: "#28a745",
              margin: [0, 5, 0, 5],
            },
            descriptionText: {
              fontSize: 11,
              color: "#555555",
            },
            footerStyle: {
              fontSize: 9,
              color: "#999999",
              italics: true,
            },
          },
          defaultStyle: {
            font: "Roboto",
            fontSize: 10,
          },
          pageMargins: [40, 60, 40, 60],
        };

        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];

        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateIncomePDF(incomeData, userData, fields = {}) {
    console.log(incomeData);
    return new Promise(async (resolve, reject) => {
      try {
        let base64Image = null;

        if (incomeData?.receipt && fields.receipt) {
          try {
            base64Image = await fetchImageAsBase64(incomeData?.receipt);
          } catch (error) {
            console.error("Failed to fetch receipt image:", error.message);
          }
        }

        const generatedDate = new Date().toLocaleDateString();
        const hasImage = !!base64Image;

        const content = [];

        // Header
        content.push({
          text: "Income Receipt",
          style: "mainHeader",
          alignment: "center",
          margin: [0, 0, 0, 30],
        });

        // User Details
        if (fields.userDetails) {
          content.push({
            table: {
              widths: ["25%", "75%"],
              body: [
                [
                  { text: "Name", style: "fieldLabel" },
                  {
                    text:
                      `${userData.firstName || ""} ${
                        userData.lastName || ""
                      }`.trim() || "-",
                    style: "fieldValue",
                  },
                ],
                [
                  { text: "Email", style: "fieldLabel" },
                  { text: userData.email || "-", style: "fieldValue" },
                ],
                [
                  { text: "Phone", style: "fieldLabel" },
                  { text: userData.phone || "-", style: "fieldValue" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) =>
                rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
            margin: [0, 0, 0, 30],
          });
        }

        // Expense Details
        if (fields.incomeDetails) {
          content.push({
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  { text: "Title", style: "fieldLabel" },
                  {
                    text: incomeData.title || "Untitled Expense",
                    style: "fieldValue",
                  },
                ],
                [
                  { text: "Date", style: "fieldLabel" },
                  {
                    text: incomeData.incomeDate
                      ? new Date(incomeData.incomeDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-",
                    style: "fieldValue",
                  },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) =>
                rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
            margin: [0, 0, 0, 20],
          });
        }

        // Expense Summary
        if (fields.incomeSummary) {
          content.push({
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  { text: "Amount", style: "tableHeader" },
                  {
                    text: `$${incomeData.amount?.toFixed(2) || "0.00"}`,
                    style: "amountHighlight",
                  },
                ],
                [
                  { text: "Category", style: "tableHeader" },
                  { text: incomeData.category || "-", style: "tableValue" },
                ],
                [
                  { text: "Payment", style: "tableHeader" },
                  {
                    text: incomeData.paymentThrough || "-",
                    style: "tableValue",
                  },
                ],
                [
                  { text: "Note", style: "tableHeader" },
                  { text: incomeData.notes || "-", style: "tableValue" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#eeeeee" : null),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#cccccc",
              vLineColor: () => "#cccccc",
            },
            margin: [0, 0, 0, 30],
          });
        }

        // Receipt Image
        if (fields.receipt && hasImage) {
          content.push({
            pageBreak: "before",
            image: base64Image,
            width: 250,
            alignment: "center",
            margin: [0, 0, 0, 30],
          });
        }

        const docDefinition = {
          content,
          footer:
            fields.footer &&
            ((currentPage, pageCount) => ({
              columns: [
                {
                  text: `Generated on: ${generatedDate}`,
                  style: "footerStyle",
                  alignment: "left",
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  style: "footerStyle",
                  alignment: "right",
                },
              ],
              margin: [40, 0, 40, 30],
            })),
          styles: {
            mainHeader: {
              fontSize: 28,
              bold: true,
              color: "#004080",
              decoration: "underline",
            },
            sectionHeader: {
              fontSize: 18,
              bold: true,
              color: "#003366",
            },
            fieldLabel: {
              fontSize: 11,
              bold: true,
              color: "#555555",
            },
            fieldValue: {
              fontSize: 11,
              color: "#111111",
            },
            tableHeader: {
              fontSize: 11,
              bold: true,
              fillColor: "#d9edf7",
              color: "#31708f",
              margin: [0, 5, 0, 5],
            },
            tableValue: {
              fontSize: 11,
              color: "#333333",
              margin: [0, 5, 0, 5],
            },
            amountHighlight: {
              fontSize: 18,
              bold: true,
              color: "#28a745",
              margin: [0, 5, 0, 5],
            },
            descriptionText: {
              fontSize: 11,
              color: "#555555",
            },
            footerStyle: {
              fontSize: 9,
              color: "#999999",
              italics: true,
            },
          },
          defaultStyle: {
            font: "Roboto",
            fontSize: 10,
          },
          pageMargins: [40, 60, 40, 60],
        };

        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];

        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
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

        pdfDoc.on("data", (chunk) => {
          chunks.push(chunk);
        });

        pdfDoc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateReportPDF(reportData, userData, fields = {}) {
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

        // ✅ Dashboard Summary Section Starts Here
        {
          text: "Summary Overview",
          style: "sectionHeader",
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            widths: ["33%", "33%", "34%"],
            body: [
              [
                { text: "Total Income", style: "tableHeader" },
                { text: "Total Expense", style: "tableHeader" },
                { text: "Net Balance", style: "tableHeader" },
              ],
              [
                `$${reportData.totalIncome}`,
                `$${reportData.totalExpense}`,
                `$${reportData.balance}`,
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              [
                { text: "Total Transactions", style: "tableHeader" },
                { text: "Top Spending Category", style: "tableHeader" },
              ],
              [
                `${reportData.transactionCount} (${reportData.period})`,
                `${reportData.topSpendingCategory?.name || "N/A"} - $${
                  reportData.topSpendingCategory?.amount || 0
                }`,
              ],
              [
                { text: "Highest Income", style: "tableHeader" },
                { text: "Highest Expense", style: "tableHeader" },
              ],
              [
                `${reportData.highestIncome?.title || "N/A"} - $${
                  reportData.highestIncome?.amount || 0
                }`,
                `${reportData.highestExpense?.title || "N/A"} - $${
                  reportData.highestExpense?.amount || 0
                }`,
              ],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 0],
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
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: "#333",
        },
        tableHeader: {
          bold: true,
          fillColor: "#f3f3f3",
          color: "#333",
          fontSize: 12,
          margin: [0, 5, 0, 5],
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

        pdfDoc.on("data", (chunk) => {
          chunks.push(chunk);
        });

        pdfDoc.on("end", () => {
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
