/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  DollarSign,
  Settings,
  TagIcon,
  Globe,
  Bell,
  Moon,
  Sun,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";

const SettingsPage = () => {
  const token = localStorage.getItem("Token");
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userdata, setUserData] = useState("");
  const [categorys, setCategorys] = useState([]);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      firstName: "", // Ensures controlled input
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const getUserdata = async () => {
      try {
        const res = await axios.get(`/userdata`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(res.data);

        // Set form values dynamically
        for (const key in res.data) {
          setValue(key, res.data[key] || ""); // Ensure controlled inputs
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getCategory = async () => {
      try {
        const res = await axios.get(`/get-category`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setCategorys(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      getUserdata();
      getCategory();
    }
  }, [token, setValue]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* <h2 className="text-xl font-semibold text-gray-800">
              Profile Settings
            </h2>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-medium text-xl">JD</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {userdata.firstName} {userdata.lastName}
                  </h3>
                  <p className="text-gray-500">{userdata.email}</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                    Change Profile Picture
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={userdata.firstName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete={userdata.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={userdata.email}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={userdata.lastName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="text"
                        autoComplete={userdata.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={userdata.phone}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Preferences
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">
                        Email Notifications
                      </span>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="notifications"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="block bg-blue-600 rounded-full h-6 w-10"></div>
                      <div className="dot absolute left-5 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">Dark Mode</span>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="dark-mode"
                        className="sr-only"
                      />
                      <div className="block bg-gray-200 rounded-full h-6 w-10"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div> */}
          </div>
        );

      case "categories":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Category Management
              </h2>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {categorys.map((category) => (
                    <li
                      key={category._id}
                      id={category.id}
                      className="flex items-center justify-between py-4"
                    >
                      {category.category_name}
                      <div className="flex items-center">
                        <button className="p-1 text-gray-400 hover:text-gray-600 mr-2">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Management
            </h2>

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Security
                </h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <span className="text-gray-700">Change Password</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <span className="text-gray-700">
                      Two-Factor Authentication
                    </span>
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
                <h3 className="text-lg font-medium text-red-600 mb-4">
                  Danger Zone
                </h3>
                <button className="w-full flex items-center justify-between px-4 py-3 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 text-red-600">
                  <span>Delete Account</span>
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );

      case "payment":
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
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Expense Preferences
            </h2>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Miscellaneous</option>
                    <option>Groceries</option>
                    <option>Transport</option>
                    <option>Entertainment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Budget
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="2,500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Budget Alerts</p>
                    <p className="text-sm text-gray-500">
                      Get notified when you&#39;re approaching your budget limit
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="budget-alerts"
                      className="sr-only"
                      defaultChecked
                    />
                    <div className="block bg-blue-600 rounded-full h-6 w-10"></div>
                    <div className="dot absolute left-5 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">
                      Receipt Scanning
                    </p>
                    <p className="text-sm text-gray-500">
                      Automatically extract data from receipts
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="receipt-scanning"
                      className="sr-only"
                      defaultChecked
                    />
                    <div className="block bg-blue-600 rounded-full h-6 w-10"></div>
                    <div className="dot absolute left-5 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Weekly Reports</p>
                    <p className="text-sm text-gray-500">
                      Receive weekly spending reports via email
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="weekly-reports"
                      className="sr-only"
                    />
                    <div className="block bg-gray-200 rounded-full h-6 w-10"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );

      case "currency":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Currency Settings
            </h2>

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
                      <input
                        type="checkbox"
                        id="auto-convert"
                        className="sr-only"
                      />
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

      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto">
        <div className="md:hidden p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <h1 className="text-xl font-bold">Settings</h1>
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } md:block md:w-64 bg-white border-r border-gray-200 h-screen md:sticky md:top-0`}
          >
            <div className="p-4 border-b border-gray-200 hidden md:block">
              <h1 className="text-xl font-bold">Settings</h1>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile Settings</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "categories"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("categories")}
                  >
                    <TagIcon className="h-5 w-5 mr-3" />
                    <span>Category Management</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "account"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Account Management</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "payment"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("payment")}
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    <span>Payment Methods</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "preferences"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("preferences")}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Expense Preferences</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                      activeTab === "currency"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("currency")}
                  >
                    <Globe className="h-5 w-5 mr-3" />
                    <span>Currency</span>
                  </button>
                </li>
              </ul>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <button className="flex items-center w-full px-4 py-2 text-left text-red-600 rounded-md hover:bg-red-50">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
