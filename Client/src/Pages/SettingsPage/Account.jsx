/* eslint-disable no-unused-vars */
import React from "react";
import { ChevronRight, Trash2 } from "lucide-react";

const Account = () => {
  return (
    <div className="space-y-6 m-5 w-[70%] mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">
        Account Management
      </h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-gray-700">Change Password</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Privacy & Data
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-gray-700">Privacy Settings</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-gray-700">Export Data</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
          <button className="w-full flex items-center justify-between px-4 py-3 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 text-red-600">
            <span>Delete Account</span>
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
