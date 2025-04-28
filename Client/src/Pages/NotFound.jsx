    import { Link } from "react-router-dom";
import { ArrowLeft, Home, DollarSign } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <DollarSign size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The financial page you&#39;re looking for seems to have been misplaced in our ledger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home size={18} />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Need help? Contact support at{" "}
          <a href="mailto:support@expensemanager.com" className="text-blue-600 hover:underline">
            support@expensemanager.com
          </a>
        </p>
      </div>

      {/* Visual embellishment - a simple expense chart illustration */}
      <div className="mt-12 flex items-end justify-center gap-2 opacity-30">
        {[40, 25, 60, 30, 75, 45, 90, 55, 35, 65, 40].map((height, index) => (
          <div
            key={index}
            style={{ height: `${height}px` }}
            className={`w-4 rounded-t-md ${
              index % 2 === 0 ? "bg-blue-500" : "bg-green-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;