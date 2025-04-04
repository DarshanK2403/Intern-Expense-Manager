/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import CustomLoader from "../../Components/CustomLoader";
import { Edit, Filter, MoreVertical, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";

const AdminUserPage = () => {
  const [totalUser, setTotaluser] = useState(null);
  const [totalExpense, setTotalexpense] = useState(null);
  const [datas, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/admin/user-details");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUserData();
  }, []);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);

    const sortedData = [...datas].sort((a, b) => {
      if (column === "totalExpenses") {
        return isAsc
          ? a.totalExpenses - b.totalExpenses
          : b.totalExpenses - a.totalExpenses;
      } else if (column === "email") {
        return isAsc
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else if (column === "role") {
        return isAsc
          ? a.role?.name?.localeCompare(b.role?.name)
          : b.role?.name?.localeCompare(a.role?.name);
      } else if (column === "isActive") {
        return isAsc ? b.isActive - a.isActive : a.isActive - b.isActive;
      }
      return 0;
    });

    setData(sortedData);
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    const getTotalUserCount = async () => {
      try {
        if (id) {
          const res = await axios.get("admin/user-details");
          console.log(res.data);
          //Store Total User Count
          setUsersData(res.data);
          setTotaluser(res.data.length);
        } else {
          toast.error("Not found User");
        }
      } catch (error) {
        // Server Error
        toast.error("Somthing goes wrong");
      }
    };
    getTotalUserCount();
  }, []);

  const filteredUsers = () => {
    if (selectedTab === "all") return usersData;
    if (selectedTab === "active")
      return usersData.filter((user) => user.isActive == "true");
    if (selectedTab === "inactive")
      return usersData.filter((user) => user.isActive == "false");
    return usersData;
  };
  return (
    <div className="p-4">
      {/* Totast Message Show */}
      <ToastContainer></ToastContainer>
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              selectedTab === "all"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setSelectedTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              selectedTab === "active"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedTab("inactive")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              selectedTab === "inactive"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inactive
          </button>
        </div>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Search users..."
            />
          </div>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center">
            <Filter size={16} className="mr-1" />
            Filter
          </button>
        </div>
      </div>

      <div className="pt-4 overflow-x-auto">
        {loading ? (
          <CustomLoader></CustomLoader>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Join Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Expenses
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expense Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Active
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers().map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                        {user.firstName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive == true
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive == true ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${user.totalExpenses}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.expenseCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
