/* eslint-disable react/prop-types */
import { Eye, EyeOff, Download } from "lucide-react";

const PDFExportModal = ({
  visible,
  onClose,
  fields,
  handleFieldToggle,
  toggleAllFields,
  onExportPDF,
  PDFData,
  renderPreview,
}) => {
  if (!visible) return null;

  return (
    <div
      className={`w-full transition-all duration-500 ease-in-out fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`w-full bg-white rounded-md shadow-lg border border-gray-200 p-6 max-w-5xl h-[90vh] transform transition-transform duration-500 flex ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Left Panel - Options */}
        <div className="w-96 pr-6 border-r border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Export PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Field Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Fields to Include</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleAllFields(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Eye size={14} className="mr-1" /> Select All
                </button>
                <button
                  onClick={() => toggleAllFields(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <EyeOff size={14} className="mr-1" /> Deselect All
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => handleFieldToggle(key)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={key}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={onExportPDF}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <Download size={16} className="mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-3/4 pl-6 overflow-y-auto">
          <h3 className="text-md font-medium mb-4">Preview</h3>
          <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg pt-4 pb-12 px-8 min-h-[75vh]">
            {renderPreview ? renderPreview(PDFData, fields) : (
              <div className="text-gray-400 text-sm italic">No preview available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportModal;
