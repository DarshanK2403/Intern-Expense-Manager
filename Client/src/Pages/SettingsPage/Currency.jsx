/* eslint-disable no-unused-vars */
import { Plus, X } from "lucide-react";
import React from "react";

const Currency = () => {
  return (
    <div className="space-y-6 m-5 w-[70%] mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">Currency Settings</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>USD - United States Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
              <option>JPY - Japanese Yen</option>
              <option>CAD - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Currencies
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded">
                <span className="text-sm">EUR</span>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded">
                <span className="text-sm">GBP</span>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center">
              <Plus className="h-3 w-3 mr-1" /> Add Currency
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  Auto-convert Expenses
                </p>
                <p className="text-sm text-gray-500">
                  Automatically convert expenses to your default currency
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="auto-convert" className="sr-only" />
                <div className="block bg-gray-200 rounded-full h-6 w-10"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Currency Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Currency;
