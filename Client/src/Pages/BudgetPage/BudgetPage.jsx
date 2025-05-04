import { useCallback, useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import axios from "axios";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { toast, ToastContainer } from "react-toastify";

const BudgetPage = () => {
  const token = localStorage.getItem("Token");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuarter, setActiveQuarter] = useState(1);

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quarters = [
    { id: 1, name: "Q1 (Jan - Mar)", months: [0, 1, 2] },
    { id: 2, name: "Q2 (Apr - Jun)", months: [3, 4, 5] },
    { id: 3, name: "Q3 (Jul - Sep)", months: [6, 7, 8] },
    { id: 4, name: "Q4 (Oct - Dec)", months: [9, 10, 11] },
  ];

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/category?type=expense`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.data);

      // Initialize expanded state for all categories
      const initialExpandedState = {};
      res.data.data.forEach((cat) => {
        initialExpandedState[cat._id] = false;
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const getBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/budget/${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data.data); // Check if response is correct

      if (res.data.success) {
        const budgetData = {};

        categories.forEach((category) => {
          budgetData[category._id] = {};
          for (let i = 0; i < 12; i++) {
            budgetData[category._id][i] = 0;
          }
        });

        res.data.data.categories.forEach((item) => {
          const category = categories.find(
            (cat) => cat._id === item.category._id
          );

          if (category) {
            item.entries.forEach((entry) => {
              budgetData[category._id][entry.month] = entry.amount;
            });
          } else {
            console.warn(
              `Category with _id ${item.category._id} not found in categories.`
            );
          }
        });

        setBudgets(budgetData);
      } else {
        console.error("Error fetching budget data:", res.data.message);
        initializeBudgets(categories);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      initializeBudgets(categories);
      setLoading(false);
    }
  }, [selectedYear, categories, token]);

  const initializeBudgets = (categoriesData) => {
    const initialBudgets = {};
    categoriesData.forEach((category) => {
      if (category._id) {
        initialBudgets[category._id] = {};
        for (let i = 0; i < 12; i++) {
          initialBudgets[category._id][i] = 0;
        }
      }
    });
    setBudgets(initialBudgets);
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      getBudgetData();
    }
  }, [selectedYear, categories, getBudgetData]);

  const getMonthlyTotal = (monthIndex) => {
    let total = 0;
    categories.forEach((category) => {
      total += budgets[category._id]?.[monthIndex] || 0;
    });
    return total;
  };

  const getQuarterlyTotal = (quarterMonths) => {
    let total = 0;
    quarterMonths.forEach((monthIndex) => {
      total += getMonthlyTotal(monthIndex);
    });
    return total;
  };

  const getCategoryQuarterlyTotal = (categoryId, quarterMonths) => {
    let total = 0;
    quarterMonths.forEach((monthIndex) => {
      total += budgets[categoryId]?.[monthIndex] || 0;
    });
    return total;
  };

  const prepareBudgetPayload = () => {
    return categories.map((category) => ({
      category: category._id,
      entries: Array.from({ length: 12 }, (_, idx) => ({
        month: idx,
        amount: Number(budgets[category._id]?.[idx] || 0),
      })),
    }));
  };

  const saveBudgets = async () => {
    const payload = {
      categories: prepareBudgetPayload(),
    };

    try {
      setSaving(true);
      setError(null);

      const response = await axios.post(`/budget/${selectedYear}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSaving(false);
        toast.success("Budget saved successfully!");
      } else {
        setSaving(false);
        setError("Failed to save budgets: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving budgets:", error);
      setError("Failed to save budgets. Please try again.");
      setSaving(false);
    }
  };

  const handleBudgetChange = (categoryId, monthIndex, value) => {
    const numValue = value === "" ? 0 : parseFloat(value);

    setBudgets((prevBudgets) => {
      const newBudgets = { ...prevBudgets };

      if (!newBudgets[categoryId]) {
        newBudgets[categoryId] = {};
      }

      newBudgets[categoryId] = {
        ...newBudgets[categoryId],
        [monthIndex]: numValue,
      };

      return newBudgets;
    });
  };

  const resetBudgets = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your budget?"
    );
    if (!confirmReset) return;

    initializeBudgets(categories);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <SpinnerLoader size="large" color="blue" />
      </div>
    );
  }

  // Get current quarter's months
  const currentQuarterMonths = quarters.find(
    (q) => q.id === activeQuarter
  ).months;

  return (
    <div className="h-full bg-gray-50 w-full">
      <ToastContainer autoClose={1500} />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Budget Manager
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mr-2"
                >
                  Year:
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {[
                    currentYear - 2,
                    currentYear - 1,
                    currentYear,
                    currentYear + 1,
                    currentYear + 2,
                  ].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveBudgets}
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Budget"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Quarter Tabs */}
        <div className="flex mb-4 border-b border-gray-400">
          {quarters.map((quarter) => (
            <button
              key={quarter.id}
              onClick={() => setActiveQuarter(quarter.id)}
              className={`px-4 py-2 font-medium text-sm ${
                activeQuarter === quarter.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {quarter.name}
            </button>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {activeQuarter > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  {currentQuarterMonths.map((monthIdx) => (
                    <th
                      key={monthIdx}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {months[monthIdx]}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    Quarterly Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, idx) => (
                  <tr
                    key={category._id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      {category.category_name}
                    </td>
                    {currentQuarterMonths.map((monthIdx) => (
                      <td
                        key={`${category._id}-${monthIdx}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        <input
                          type="number"
                          value={budgets[category._id]?.[monthIdx] || 0}
                          onChange={(e) =>
                            handleBudgetChange(
                              category._id,
                              monthIdx,
                              e.target.value
                            )
                          }
                          step="100"
                          className="w-24 border border-gray-300 rounded p-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                          min="0"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-blue-50 text-center">
                      {currencyFormatter.format(
                        getCategoryQuarterlyTotal(
                          category._id,
                          currentQuarterMonths
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-gray-100 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Total
                  </td>
                  {currentQuarterMonths.map((monthIdx) => (
                    <td
                      key={`total-${monthIdx}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center"
                    >
                      {currencyFormatter.format(getMonthlyTotal(monthIdx))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-blue-100 text-center">
                    {currencyFormatter.format(
                      getQuarterlyTotal(currentQuarterMonths)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            " "
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={resetBudgets}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Reset
          </button>
        </div>
      </main>
    </div>
  );
};

export default BudgetPage;
