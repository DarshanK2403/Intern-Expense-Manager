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
                    text: `${expenseData.amount?.toFixed(2) || "0.00"}`,
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

  generateReportPDF(reportData, userData, fields = {}) {
    console.log(reportData?.expenseChart)
    // Define styles for the PDF
    const styles = {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        fillColor: "#f2f2f2",
      },
      tableRow: {
        fontSize: 9,
      },
      tableRowEven: {
        fontSize: 9,
        fillColor: "#f9f9f9",
      },
      metaLabel: {
        bold: true,
        fontSize: 10,
      },
      metaValue: {
        fontSize: 10,
      },
      footer: {
        fontSize: 8,
        italic: true,
        color: "#666666",
      },
    };

    // Format currency helper
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    // Format date helper
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    // Calculate budget total
    const BudgetTotal = Object.values(reportData.budgetData || {}).reduce(
      (acc, amount) => acc + amount,
      0
    );
    const remainingBudget = BudgetTotal - reportData?.totalExpense;

    // Build the document content
    const docDefinition = {
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
      },
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      content: [],
      styles: styles,
      footer: function (currentPage, pageCount) {
        return fields.footer
          ? {
              columns: [
                {
                  text: `Generated on: ${new Date().toLocaleDateString()}`,
                  style: "footer",
                  alignment: "left",
                  margin: [40, 0, 0, 0],
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  style: "footer",
                  alignment: "right",
                  margin: [0, 0, 40, 0],
                },
              ],
            }
          : null;
      },
    };

    // 1. Add Report Header
    docDefinition.content.push(
      { text: "Report", style: "header" },
      {
        columns: [
          {
            width: "50%",
            text: [
              { text: "Date: ", style: "metaLabel" },
              {
                text: `${formatDate(reportData.startDate)} to ${formatDate(
                  reportData.endDate
                )}`,
                style: "metaValue",
              },
            ],
          },
          {
            width: "50%",
            text: [
              { text: "Report Type: ", style: "metaLabel" },
              {
                text:
                  reportData.type.charAt(0).toUpperCase() +
                  reportData.type.slice(1),
                style: "metaValue",
              },
            ],
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 20],
      }
    );

    // 2. Add User Information (if overview field is enabled)
    if (fields.overview) {
      docDefinition.content.push({
        table: {
          widths: ["30%", "70%"],
          headerRows: 0,
          body: [
            [
              { text: "Name", style: "tableHeader" },
              { text: `${userData.firstName} ${userData.lastName}` },
            ],
            [{ text: "Email", style: "tableHeader" }, { text: userData.email }],
            [{ text: "Phone", style: "tableHeader" }, { text: userData.phone }],
          ],
        },
        margin: [0, 0, 0, 15],
      });

      // 3. Add Financial Overview
      docDefinition.content.push(
        { text: "Financial Overview", style: "subheader" },
        {
          layout: "lightHorizontalLines",
          table: {
            widths: ["60%", "40%"],
            headerRows: 0,
            body: [
              [
                { text: "Top Spending Category:", style: "metaLabel" },
                {
                  text: reportData.topSpendingCategory?.name
                    ? `${reportData.topSpendingCategory.name} (${formatCurrency(
                        reportData.topSpendingCategory.amount
                      )})`
                    : "N/A",
                  alignment: "right",
                },
              ],
              [
                { text: "Highest Income:", style: "metaLabel" },
                {
                  text: reportData.highestIncome
                    ? `${reportData.highestIncome.title} (${formatCurrency(
                        reportData.highestIncome.amount
                      )})`
                    : "N/A",
                  alignment: "right",
                },
              ],
              [
                { text: "Highest Expense:", style: "metaLabel" },
                {
                  text: reportData.highestExpense
                    ? `${reportData.highestExpense.title} (${formatCurrency(
                        reportData.highestExpense.amount
                      )})`
                    : "N/A",
                  alignment: "right",
                },
              ],
              [
                { text: "Total Transactions:", style: "metaLabel" },
                {
                  text: `${reportData.transaction?.length || 0}`,
                  alignment: "right",
                },
              ],
              [
                { text: "Saving Rate:", style: "metaLabel" },
                { text: `${reportData.savingRate || 0}%`, alignment: "right" },
              ],
            ],
          },
          margin: [0, 0, 0, 15],
        }
      );

      // 4. Add Budget Status
      const budgetUsage = Math.min(
        100,
        (reportData.totalExpense / BudgetTotal) * 100
      );
      docDefinition.content.push({
        stack: [
          {
            columns: [
              { text: "Budget Status", style: "metaLabel", width: "70%" },
              {
                text: reportData.isOverBudget ? "⚠️ Over Budget" : "",
                width: "30%",
                alignment: "right",
              },
            ],
          },
          {
            columns: [
              { text: `Budget: ${formatCurrency(BudgetTotal)}`, width: "50%" },
              {
                text: `Remaining: ${formatCurrency(remainingBudget)}`,
                width: "50%",
                alignment: "right",
              },
            ],
            margin: [0, 5, 0, 5],
          },
          {
            canvas: [
              {
                type: "rect",
                x: 0,
                y: 0,
                w: 515,
                h: 15,
                r: 3,
                lineColor: "#E0E0E0",
                fillColor: "#F5F5F5",
              },
              {
                type: "rect",
                x: 0,
                y: 0,
                w: 515 * (budgetUsage / 100),
                h: 15,
                r: 3,
                lineColor: "#4CAF50",
                fillColor: "#4CAF50",
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      });
    }

    if (fields.charts) {
      docDefinition.content.push({
        image: "data:image/png;base64," + reportData.chartImg,
        width: 500,
        alignment: "center",
      });
    }

    if (fields.charts) {
      docDefinition.content.push({
        image: "data:image/png;base64," + reportData.chartImg,
        width: 500,
        alignment: "center",
      });
    }

    // 6. Add Transactions table
    if (fields.transaction && reportData.transaction?.length > 0) {
      const transactionRows = [
        [
          { text: "Title", style: "tableHeader" },
          { text: "Amount", style: "tableHeader" },
          { text: "Date", style: "tableHeader" },
          { text: "Category", style: "tableHeader" },
          { text: "Notes", style: "tableHeader" },
        ],
      ];

      reportData.transaction.forEach((txn, idx) => {
        const rowStyle = idx % 2 === 0 ? "tableRow" : "tableRowEven";

        transactionRows.push([
          { text: txn.title, style: rowStyle },
          {
            text: txn.incomeDate ? `+₹${txn.amount}` : `-₹${txn.amount}`,
            style: rowStyle,
          },
          {
            text: formatDate(txn?.incomeDate || txn?.expenseDate),
            style: rowStyle,
          },
          { text: txn.category?.category_name, style: rowStyle },
          { text: txn.notes || "-", style: rowStyle },
        ]);
      });

      docDefinition.content.push(
        { text: "Transactions", style: "subheader", pageBreak: "before" },
        {
          table: {
            widths: ["20%", "15%", "20%", "20%", "25%"],
            headerRows: 1,
            body: transactionRows,
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? null : "#f9f9f9";
            },
          },
        },
        {
          text: `Showing ${reportData.transaction.length} transactions`,
          fontSize: 8,
          alignment: "right",
          margin: [0, 5, 0, 15],
        }
      );
    }

    // 7. Add Budget vs Actual table
    if (fields.budget && reportData.budgetVsActual?.length > 0) {
      const budgetRows = [
        [
          { text: "Category", style: "tableHeader" },
          { text: "Budgeted", style: "tableHeader" },
          { text: "Spent", style: "tableHeader" },
          { text: "Remaining", style: "tableHeader" },
        ],
      ];

      reportData.budgetVsActual.forEach((b, idx) => {
        const rowStyle = idx % 2 === 0 ? "tableRow" : "tableRowEven";

        budgetRows.push([
          { text: b.category_name, style: rowStyle },
          { text: `₹${b.budgeted}`, style: rowStyle },
          { text: `₹${b.spent}`, style: rowStyle },
          { text: `₹${b.remaining}`, style: rowStyle },
        ]);
      });

      docDefinition.content.push(
        { text: "Budget vs Actual", style: "subheader", pageBreak: "before" },
        {
          table: {
            widths: ["40%", "20%", "20%", "20%"],
            headerRows: 1,
            body: budgetRows,
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? null : "#f9f9f9";
            },
          },
        },
        {
          text: "[Budget vs Actual chart would appear here]",
          italics: true,
          alignment: "center",
          margin: [0, 20, 0, 5],
        }
      );
    }

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
