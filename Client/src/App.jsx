import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
const SigninPage = lazy(() => import("./common/SigninPage"));
const SignupPage = lazy(() => import("./common/SignupPage"));
const DashboardLayout = lazy(() => import("./Layouts/DashboardLayout"));
const Dashboard = lazy(() => import("./Pages/DashboardPage/Dashboard"));
const SkeletonLoader = lazy(() => import("./Components/SkeletonLoader"));
const ExpensesPage = lazy(() => import("./Pages/ExpensesPage/ExpensesPage"));
const ReportsPage = lazy(() => import("./Pages/ReportsPage/ReportsPage"));
const AddExpenseForm = lazy(() =>
  import("./Pages/ExpensesPage/AddExpenseForm")
);
const ExpenseLayout = lazy(() => import("./Layouts/ExpenseLayout"));
import { PrivateRoute, AdminRoute } from "./hooks/PrivateRoute";
import BudgetPage from "./Pages/BudgetPage/BudgetPage";
import BudgetPagelayout from "./Layouts/BudgetPagelayout";
import VendorDetail from "./Pages/VendorPage/VendorDetail";
const AddIncome = lazy(() => import("./Pages/IncomePage/AddIncome"));
const RecentTransactios = lazy(() =>
  import("./Pages/DashboardPage/RecentTransactios")
);
const ForgetPasswordPage = lazy(() => import("./common/ForgetPasswordPage"));
const VendorLayout = lazy(() => import("./Layouts/VendorLayout"));
const AddVendor = lazy(() => import("./Pages/VendorPage/AddVendor"));
const VendorPage = lazy(() => import("./Pages/VendorPage/VendorPage"));
const ChangePassword = lazy(() =>
  import("./Pages/SettingsPage/ChangePassword")
);
const UpdateVendor = lazy(() => import("./Pages/VendorPage/UpdateVendor"));
const EditExpense = lazy(() => import("./Pages/ExpensesPage/EditExpense"));
const EditIncome = lazy(() => import("./Pages/IncomePage/EditIncome"));
const DetailIncome = lazy(() => import("./Pages/IncomePage/DetailIncome"));
const SavedReport = lazy(() => import("./Pages/ReportsPage/SavedReport"));
const ReportDetail = lazy(() => import("./Pages/ReportsPage/ReportDetail"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const History = lazy(() => import("./Pages/SettingsPage/History"));
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
const AdminUserPage = lazy(() => import("./admin/Page/AdminUserPage"));
const AdminSettingPage = lazy(() => import("./admin/Page/AdminSettingPage"));

axios.defaults.baseURL = "http://localhost:3000/";
function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<NotFound />} />
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
                <Route path="edit-expense/:id" element={<EditExpense />} />
              </Route>

              <Route path="/income" element={<IncomeLayout />}>
                <Route index element={<IncomePage />} />
                <Route path="add" element={<AddIncome />} />
                <Route path="detail-income/:id" element={<DetailIncome />} />
                <Route path="edit-income/:id" element={<EditIncome />} />
              </Route>

              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorPage />} />
                <Route path="add" element={<AddVendor />} />
                <Route path="edit/:id" element={<UpdateVendor />} />
                <Route path="detail/:id" element={<VendorDetail />} />
                
              </Route>

              <Route path="/settings" element={<SettingLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="category" element={<Category />} />
                <Route path="account" element={<Account />} />
                <Route path="payment" element={<Payment />} />
                <Route path="currency" element={<Currency />} />
                <Route
                  path="profile/change-password"
                  element={<ChangePassword />}
                />
                <Route path="history" element={<History />} />
              </Route>

              <Route path="/reports" element={<ReportLayout />}>
                <Route index element={<Navigate to="generate" replace />} />
                <Route path="generate" element={<ReportsPage />} />
                <Route path="saved" element={<SavedReport />} />
                <Route path="detail/:id" element={<ReportDetail />} />
              </Route>

              <Route path="/budget" element={<BudgetPagelayout />}>
                <Route index element={<BudgetPage/>} />
              </Route>

            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index path="dashboard" element={<AdminPage />} />

                <Route path="users" element={<AdminUserPage />} />

                <Route
                  index
                  path="settings"
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
