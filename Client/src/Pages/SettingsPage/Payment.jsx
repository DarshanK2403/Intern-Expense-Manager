import { Edit, Plus, Trash2 } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import React from 'react'

const Payment = () => {
  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">
        Payment Methods
      </h2>
      <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
        <Plus className="h-4 w-4 mr-1" /> Add Payment Method
      </button>
    </div>

    <div className="bg-white rounded-lg shadow">
      <div className="p-6 space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-14 bg-blue-800 rounded mr-4 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2026</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 text-gray-400 hover:text-gray-600 mr-2">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-14 bg-red-600 rounded mr-4 flex items-center justify-center">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
            <div>
              <p className="font-medium">Mastercard ending in 5555</p>
              <p className="text-sm text-gray-500">Expires 08/2025</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 text-gray-400 hover:text-gray-600 mr-2">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-14 bg-blue-400 rounded mr-4 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                PAYPAL
              </span>
            </div>
            <div>
              <p className="font-medium">PayPal</p>
              <p className="text-sm text-gray-500">
                john.doe@example.com
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Payment
