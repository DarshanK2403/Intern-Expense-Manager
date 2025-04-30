import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import axios from "axios";

const BudgetPage = () => {
  const token = localStorage.getItem("Token");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/category?type=expense`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
      setLoading(false);
    }
  };

  const getBudgetData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/budget/${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Transform API data to the structure we use in our component
        const budgetData = {};

        // Initialize empty budgets for all categories first
        categories.forEach((category) => {
          budgetData[category._id] = {};
          for (let i = 0; i < 12; i++) {
            budgetData[category._id][i] = 0;
          }
        });

        // Fill in data from API response
        if (res.data.data && res.data.data.categories) {
          res.data.data.categories.forEach((item) => {
            // Find the category by name
            const category = categories.find(
              (cat) => cat.category_name === item.name
            );

            if (category) {
              // Process entries for this category
              item.entries.forEach((entry) => {
                budgetData[category._id][entry.month] = entry.amount;
              });
            }
          });
        }

        setBudgets(budgetData);
      } else {
        console.error("Error fetching budget data:", res.data.message);
        // If no data, initialize empty budgets
        initializeBudgets(categories);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      // If error, initialize empty budgets
      initializeBudgets(categories);
      setLoading(false);
    }
  };

  const initializeBudgets = (categoriesData) => {
    const initialBudgets = {};
    categoriesData.forEach((category) => {
      initialBudgets[category._id] = {};
      for (let i = 0; i < 12; i++) {
        initialBudgets[category._id][i] = 0;
      }
    });
    setBudgets(initialBudgets);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      getBudgetData();
    }
  }, [selectedYear, categories]);

  const getMonthlyTotal = (monthIndex) => {
    let total = 0;
    categories.forEach((category) => {
      total += budgets[category._id]?.[monthIndex] || 0;
    });
    return total;
  };

  const getCategoryYearlyTotal = (categoryId) => {
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total += budgets[categoryId]?.[i] || 0;
    }
    return total;
  };

  const getTotalBudget = () => {
    let total = 0;
    categories.forEach((category) => {
      total += getCategoryYearlyTotal(category._id);
    });
    return total;
  };

  const prepareBudgetPayload = () => {
    return categories.map((category) => ({
      name: category.category_name,
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
        alert("Budget saved successfully!");
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
      // Create a new object to avoid mutation
      const newBudgets = { ...prevBudgets };

      // If this category doesn't exist in budgets yet, initialize it
      if (!newBudgets[categoryId]) {
        newBudgets[categoryId] = {};
      }

      // Update the specific month for this category
      newBudgets[categoryId] = {
        ...newBudgets[categoryId],
        [monthIndex]: numValue,
      };

      return newBudgets;
    });
  };

  const resetBudgets = () => {
    // Reset all budgets to zero
    initializeBudgets(categories);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
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
      <main className="mx-auto w-full py-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Budget Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-t border-gray-300">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r"
                  >
                    Category
                  </th>
                  {months.map((month, idx) => (
                    <th
                      key={`${month}-${idx}`}
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {month}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, categoryIdx) => (
                  <tr
                    key={category._id}
                    className={
                      categoryIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10 border-r flex items-center">
                      {category.category_name}
                    </td>
                    {months.map((month, idx) => (
                      <td
                        key={`${category._id}-${idx}`}
                        className="px-2 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        <input
                          type="number"
                          value={budgets[category._id]?.[idx] || 0}
                          onChange={(e) =>
                            handleBudgetChange(
                              category._id,
                              idx,
                              e.target.value
                            )
                          }
                          step="0.01"
                          className="w-24 border-0 p-0 focus:ring-0 text-right focus:outline-none"
                          min="0"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-blue-50">
                      {currencyFormatter.format(
                        getCategoryYearlyTotal(category._id)
                      )}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-gray-100 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-gray-100 z-10 border-r">
                    Monthly Total
                  </td>
                  {months.map((month, idx) => (
                    <td
                      key={`total-${idx}`}
                      className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-right"
                    >
                      {currencyFormatter.format(getMonthlyTotal(idx))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-blue-100">
                    {currencyFormatter.format(getTotalBudget())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
