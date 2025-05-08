/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CustomLoader from "../../Components/CustomLoader";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  IndianRupee,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

const AdminUserPage = () => {
  const [original, setOriginal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [usersData, setUsersData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const token = localStorage.getItem("Token");
  const getUserData = async () => {
    try {
      if (token) {
        const res = await axios.get("admin/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(res.data);
        setOriginal(res.data);
      } else {
        toast.error("Not found User");
      }
    } catch (error) {
      toast.error("Somthing goes wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    applyFilter("");
  }, []);

  const handleSort = (column) => {
    let newDirection = "asc";
    let direction = "asc";

    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === column && sortConfig.direction === "desc") {
      direction = null;
    }

    setSortConfig({ key: column, direction });

    if (sortColumn === column) {
      if (sortDirection === "asc") newDirection = "desc";
      else if (sortDirection === "desc") newDirection = null;
      else newDirection = "asc";
    }

    setSortColumn(column);
    setSortDirection(newDirection);

    if (newDirection === null) {
      setUsersData(original);
      return;
    }

    // Sort the data based on the selected column and direction
    const sorted = [...usersData].sort((a, b) => {
      if (column === "email") {
        return newDirection === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      if (column === "createdAt") {
        return newDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (column === "TotalExpenseAmount") {
        return newDirection === "asc"
          ? a.TotalExpenseAmount - b.TotalExpenseAmount
          : b.TotalExpenseAmount - a.TotalExpenseAmount;
      }
      if (column === "expenseCount") {
        return newDirection === "asc"
          ? a.expenseCount - b.expenseCount
          : b.expenseCount - a.expenseCount;
      }
      return 0;
    });

    setUsersData(sorted);
  };

  const applyFilter = useCallback(
    (term) => {
      let filteredData = [...original];

      // Search Filter
      if (term) {
        filteredData = filteredData.filter(
          (item) =>
            item.email.toLowerCase().includes(term.toLowerCase()) ||
            item.firstName.toLowerCase().includes(term.toLowerCase()) ||
            item.lastName.toLowerCase().includes(term.toLowerCase())
        );
      }

      setUsersData(filteredData);
    },
    [original, setUsersData]
  );

  // Add this function to your component
  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    window.confirm(
      `Are you sure you want to change this user's role to ${newRole}?`
    );
    try {
      const res = await axios.patch(
        `/admin/users/${userId}/role`,
        { roleName: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User role updated");
      getUserData();
      // You can refresh users list here if needed
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const toggleActiveStatus = () => {};

  const deleteUser = async () => {};

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="p-4">
      {/* Totast Message Show */}
      <ToastContainer></ToastContainer>
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Header */}
        <div className="flex space-x-2">
          <h2 className="text-2xl text-gray-800">Users</h2>
        </div>
        {/* Search & Filter */}
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>

            {/* Search */}
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Search users..."
              onChange={(e) => applyFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 overflow-x-auto">
        {loading ? (
          <CustomLoader></CustomLoader>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* EMAIL / USER */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 min-w-[150px]"
                >
                  <button onClick={() => handleSort("email")}>
                    <div className="flex gap-2 items-center">
                      User
                      <div className="flex flex-col items-center w-4 transition-all">
                        <ChevronUp
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "email" &&
                            sortConfig.direction === "desc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "email" &&
                            sortConfig.direction === "asc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                </th>

                {/* ROLE */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>

                {/* STATUS */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>

                {/* JOIN DATE */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 min-w-[150px]"
                >
                  <button onClick={() => handleSort("createdAt")}>
                    <div className="flex gap-2 items-center">
                      Join Date
                      <div className="flex flex-col items-center w-4 transition-all">
                        <ChevronUp
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "createdAt" &&
                            sortConfig.direction === "desc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "createdAt" &&
                            sortConfig.direction === "asc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                </th>

                {/* TOTAL EXPENSES */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 min-w-[150px]"
                >
                  <button onClick={() => handleSort("TotalExpenseAmount")}>
                    <div className="flex gap-2 items-center">
                      Total Expenses
                      <div className="flex flex-col items-center w-4 transition-all">
                        <ChevronUp
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "TotalExpenseAmount" &&
                            sortConfig.direction === "desc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "TotalExpenseAmount" &&
                            sortConfig.direction === "asc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                </th>

                {/* EXPENSE COUNT */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 min-w-[150px]"
                >
                  <button onClick={() => handleSort("expenseCount")}>
                    <div className="flex gap-2 items-center">
                      Expense Count
                      <div className="flex flex-col items-center w-4 transition-all">
                        <ChevronUp
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "expenseCount" &&
                            sortConfig.direction === "desc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-200 ${
                            sortConfig.key === "expenseCount" &&
                            sortConfig.direction === "asc"
                              ? "text-gray-800"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                </th>

                {/* ACTIONS */}
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {/* Profile Img & Name & Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium overflow-hidden">
                        {user?.profileImg ? (
                          <img src={user.profileImg} alt="" />
                        ) : (
                          user?.firstName.charAt(0)
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {user.role.name}
                    </div>
                  </td>

                  {/* Status */}
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

                  {/* Join Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </td>

                  {/* Total Expenses */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <IndianRupee className="h-4 w-4" />
                      {user.TotalExpenseAmount.toFixed(2)}
                    </div>
                  </td>

                  {/* Expense Count */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm pe-5 text-gray-900">
                      {user.expenseCount}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <div className="flex items-center justify-end space-x-3">
                      {/* More menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === user._id ? null : user._id
                            );
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === user._id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUserRole(user._id, user.role.name);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Make{" "}
                              {user.role.name.toLowerCase() === "admin"
                                ? "User"
                                : "Admin"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActiveStatus(user._id, user.isActive);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Set {user.isActive ? "Inactive" : "Active"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUser(user._id);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            >
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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
