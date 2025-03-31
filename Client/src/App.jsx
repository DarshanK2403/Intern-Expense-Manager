import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import SkeletonLoader from "./Components/SkeletonLoader";
const SigninPage = lazy(() => import("./common/SigninPage"));
const SignupPage = lazy(() => import("./common/SignupPage"));
const Dashboard = lazy(() => import("./Pages/DashboardPage/Dashboard"));
const DashboardLayout = lazy(() => import("./Layouts/DashboardLayout"));
const ExpensesPage = lazy(() => import("./Pages/ExpensesPage/ExpensesPage"));
const ReportsPage = lazy(() => import("./Pages/ReportsPage/ReportsPage"));
const AddExpenseForm = lazy(() =>
  import("./Pages/ExpensesPage/AddExpenseForm")
);
const ExpenseLayout = lazy(() => import("./Layouts/ExpenseLayout"));
import { PrivateRoute, AdminRoute } from "./hooks/PrivateRoute";
import AddIncome from "./Pages/IncomePage/AddIncome";
import RecentTransactios from "./Pages/DashboardPage/RecentTransactios";
import ForgetPasswordPage from "./common/ForgetPasswordPage";
import VendorLayout from "./Layouts/VendorLayout";
import AddVendor from "./Pages/VendorPage/AddVendor";
import VendorPage from "./Pages/VendorPage/VendorPage";
const Home = lazy(() => import("./common/Home"));
const ReportLayout = lazy(() => import("./Layouts/ReportLayout"));
const SettingLayout = lazy(() => import("./Layouts/SettingLayout"));
const Profile = lazy(() => import("./Pages/SettingsPage/Profile"));
const Category = lazy(() => import("./Pages/SettingsPage/Category"));
const Account = lazy(() => import("./Pages/SettingsPage/Account"));
const Currency = lazy(() => import("./Pages/SettingsPage/Currency"));
const DetailExpense = lazy(() => import("./Pages/ExpensesPage/DetailExpense"));
const Payment = lazy(() => import("./Pages/SettingsPage/Payment"));
const IncomeLayout = lazy(() => import("./Layouts/IncomeLayout"));
const IncomePage = lazy(() => import("./Pages/IncomePage/IncomePage"));
const AdminPage = lazy(() => import("./admin/Page/AdminPage"));
const AdminLayout = lazy(() => import("./admin/Layout/AdminLayout"));
const AdminExpensePage = lazy(() => import("./admin/Page/AdminExpensePage"));
const AdminReportPage = lazy(() => import("./admin/Page/AdminReportPage"));
const AdminUserPage = lazy(() => import("./admin/Page/AdminUserPage"));
const AdminSettingPage = lazy(() => import("./admin/Page/AdminSettingPage"));
function App() {
  axios.defaults.baseURL = "http://localhost:3000/";

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />
            <Route
              path="/forget-password/:token"
              element={<ForgetPasswordPage />}
            />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route
                  path="recent-transactions"
                  element={<RecentTransactios />}
                />
              </Route>

              <Route path="/expenses" element={<ExpenseLayout />}>
                <Route index element={<ExpensesPage />} />
                <Route path="add" element={<AddExpenseForm />} />
                <Route path="expense-detail/:id" element={<DetailExpense />} />
              </Route>

              <Route path="/income" element={<IncomeLayout />}>
                <Route index element={<IncomePage />} />
                <Route path="add" element={<AddIncome />} />
              </Route>

              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorPage />} />
                <Route path="add" element={<AddVendor />} />
              </Route>

              {/* Settings Route */}
              <Route path="/settings" element={<SettingLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="category" element={<Category />} />
                <Route path="account" element={<Account />} />
                <Route path="payment" element={<Payment />} />
                <Route path="currency" element={<Currency />} />
              </Route>
              {/* Report Route */}

              <Route path="/reports" element={<ReportLayout />}>
                <Route index element={<ReportsPage />} />
              </Route>

              {/* Expense Route */}
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/" element={<AdminLayout />}>
                <Route index path="admin/dashboard" element={<AdminPage />} />
                <Route
                  index
                  path="admin/expenses"
                  element={<AdminExpensePage />}
                />
                <Route
                  index
                  path="admin/reports"
                  element={<AdminReportPage />}
                />
                <Route index path="admin/users" element={<AdminUserPage />} />

                <Route
                  index
                  path="admin/settings"
                  element={<AdminSettingPage />}
                />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
