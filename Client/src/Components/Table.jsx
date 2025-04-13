/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const Table = ({
  headers,
  data,
  onEdit,
  onDelete,
  itemsPerPage = 10, // Default items per page
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

  // Check if data is an array, if not, provide an empty array as fallback
  const tableData = Array.isArray(data) ? data : [];

  // Calculate pagination values
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    // Reset to first page when changing rows per page
    setCurrentPage(1);
  };

  // Universal data cell renderer
  const renderCellContent = (item, field) => {
    const value = item[field];

    // Handle different data types
    if (value === null || value === undefined) {
      return "-";
    } else if (typeof value === "object" && value instanceof Date) {
      return value.toLocaleDateString();
    } else if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    } else if (typeof value === "number") {
      return value.toString();
    } else {
      return value;
    }
  };

  return (
    <div>
      <div className="flex justify-end m-4">
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="mr-2 text-sm text-gray-700">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rounded border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="p-4 text-left font-medium">
                {header.title}
              </th>
            ))}
            <th className="p-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.length > 0 ? (
            currentItems.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {renderCellContent(item, header.field)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {onEdit && (
                      <button
                        className="text-gray-600 hover:text-indigo-600"
                        onClick={() => onEdit(item._id)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => onDelete(item._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between sm:hidden w-full">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${
                  currentPage === 1
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
            >
              Previous
            </button>
            <div className="px-4 py-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${
                  currentPage === totalPages
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {endIndex > totalItems ? totalItems : endIndex}
                </span>
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2
                    ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page number buttons */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show limited page numbers for better UX
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                          ${
                            currentPage === page
                              ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    // Show ellipsis
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2
                    ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
