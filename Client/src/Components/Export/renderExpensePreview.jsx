import { IndianRupee } from "lucide-react";

export const renderExpensePreview = (PDFData, fields) => {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800 underline">
          Expense Receipt
        </h1>
      </div>

      {/* User Details */}
      {fields.userDetails && (
        <div className="mb-8">
          <table className="w-full mb-6">
            <tbody>
              <tr className="bg-gray-100">
                <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                  Name
                </td>
                <td className="py-2 px-3 text-sm">{`${PDFData.userData.firstName} ${PDFData.userData.lastName}`}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                  Email
                </td>
                <td className="py-2 px-3 text-sm">{PDFData.userData.email}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                  Phone
                </td>
                <td className="py-2 px-3 text-sm">{PDFData.userData.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Details */}
      {fields.expenseDetails && (
        <div className="mb-6">
          <table className="w-full mb-4">
            <tbody>
              <tr className="bg-gray-100">
                <td className="py-2 px-3 w-1/2 text-sm font-semibold text-gray-600">
                  Title
                </td>
                <td className="py-2 px-3 text-sm">
                  {PDFData.expenseData.title}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 w-1/2 text-sm font-semibold text-gray-600">
                  Date
                </td>
                <td className="py-2 px-3 text-sm">
                  {new Date(PDFData.expenseData.expenseDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Summary */}
      {fields.expenseSummary && (
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <tbody>
              <tr>
                <td className="py-2 px-3 border border-gray-300 bg-blue-50 w-1/2 text-sm font-semibold text-blue-800">
                  Amount
                </td>
                <td className="py-2 px-3 border border-gray-300 text-lg font-bold text-green-600 flex items-center">
                  <IndianRupee size={20} />
                  {PDFData.expenseData.amount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                  Category
                </td>
                <td className="py-2 px-3 border border-gray-300 text-sm">
                  {PDFData.expenseData.category}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                  Payment Method
                </td>
                <td className="py-2 px-3 border border-gray-300 text-sm">
                  {PDFData.expenseData.paymentThrough}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                  Vendor
                </td>
                <td className="py-2 px-3 border border-gray-300 text-sm">
                  {PDFData.expenseData.vendor}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Description */}
      {fields.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-600">
            {PDFData.expenseData.description}
          </p>
        </div>
      )}

      {/* Receipt Image */}
      {fields.receipt && (
        <div className="mb-6 flex justify-center">
          <img
            src={PDFData.expenseData.receipt}
            alt="Receipt"
            className="border border-gray-300 p-1"
          />
        </div>
      )}

      {/* Footer */}
      {fields.footer && (
        <div className="absolute bottom-4 left-0 right-0 px-8 text-xs text-gray-500 italic flex justify-between">
          <span>Generated on: {new Date().toLocaleDateString()}</span>
          <span>Page 1 of 1</span>
        </div>
      )}
    </>
  );
};
