import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

/**
 * Generates a full report PDF with Summary, Income, and Expense sections.
 * @param {Array} reportData - All transactions (mixed income and expense).
 * @param {String} userId - ID of the user generating the report.
 * @param {String} title - Title of the report.
 */
export const exportPDF = async (reportData, userId, title = "Expense Report") => {
  try {
    const doc = new jsPDF();

    const expenseData = reportData.filter(item => item.expenseDate);
    const incomeData = reportData.filter(item => item.incomeDate);

    const totalIncome = incomeData.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpense = expenseData.reduce((sum, e) => sum + Number(e.amount), 0);
    const balance = totalIncome - totalExpense;

    // --- TITLE ---
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // --- SUMMARY SECTION ---
    doc.setFontSize(14);
    doc.text("Summary", 14, 30);
    doc.setFontSize(12);
    doc.text(`Total Income: ₹${totalIncome}`, 14, 38);
    doc.text(`Total Expense: ₹${totalExpense}`, 14, 45);
    doc.text(`Balance: ₹${balance}`, 14, 52);

    let currentY = 60;

    // --- INCOME TABLE ---
    if (incomeData.length > 0) {
      doc.setFontSize(14);
      doc.text("Income", 14, currentY);
      currentY += 5;
      doc.autoTable({
        startY: currentY,
        head: [["Title", "Amount", "Category", "Date"]],
        body: incomeData.map((item) => [
          item.title,
          `₹${item.amount}`,
          item.category,
          item.incomeDate,
        ]),
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // --- EXPENSE TABLE ---
    if (expenseData.length > 0) {
      doc.setFontSize(14);
      doc.text("Expense", 14, currentY);
      currentY += 5;
      doc.autoTable({
        startY: currentY,
        head: [["Title", "Amount", "Category", "Date"]],
        body: expenseData.map((item) => [
          item.title,
          `₹${item.amount}`,
          item.category,
          item.expenseDate,
        ]),
      });
    }

    // --- SAVE LOCALLY ---
    doc.save(`${title}.pdf`);

    // --- SAVE TO SERVER (optional) ---
    const pdfBase64 = doc.output("datauristring");
    await axios.post("/api/report/save", {
      userId,
      title,
      pdf: pdfBase64,
    });

    console.log("✅ Full PDF (Report + Income + Expense) saved to server.");
  } catch (error) {
    console.error("❌ Error generating full PDF:", error);
  }
};
