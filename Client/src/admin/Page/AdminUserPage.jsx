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
import { Edit, Trash2 } from "lucide-react";

const AdminUserPage = () => {
  const [totalUser, setTotaluser] = useState(null);
  const [totalExpense, setTotalexpense] = useState(null);
  const [datas, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

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
          // console.log(res.data);
          //Store Total User Count
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
  return (
    <div className="p-4">
      {/* Totast Message Show */}
      <ToastContainer></ToastContainer>
      <div className="pt-4">
        {loading ? (
          <CustomLoader></CustomLoader>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "email"}
                      direction={sortColumn === "email" ? sortOrder : "asc"}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "isActive"}
                      direction={sortColumn === "isActive" ? sortOrder : "asc"}
                      onClick={() => handleSort("isActive")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "role"}
                      direction={sortColumn === "role" ? sortOrder : "asc"}
                      onClick={() => handleSort("role")}
                    >
                      Role
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "totalExpenses"}
                      direction={
                        sortColumn === "totalExpenses" ? sortOrder : "asc"
                      }
                      onClick={() => handleSort("totalExpenses")}
                    >
                      Total Expenses
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "totalExpenses"}
                      direction={
                        sortColumn === "totalExpenses" ? sortOrder : "asc"
                      }
                      onClick={() => handleSort("totalExpenses")}
                    >
                      Total Income
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datas.length > 0 ? (
                  datas.map((data) => (
                    <TableRow key={data._id} className="hover:bg-gray-100">
                      <TableCell>{data.email}</TableCell>
                      <TableCell>
                        {data.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Deactivate</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {data.role?.name?.toUpperCase() === "ADMIN" ? (
                          <span className="uppercase text-blue-600">Admin</span>
                        ) : (
                          <span className="uppercase">User</span>
                        )}
                      </TableCell>
                      <TableCell>{data.totalExpenses}</TableCell>
                      <TableCell>{data.totalIncome}</TableCell>
                      <TableCell>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          // onClick={() => deleteCategory(category._id)}
                        >
                          {data.isActive ? (
                            <span className="text-red-600 uppercase">
                              deactivate
                            </span>
                          ) : (
                            <span className="text-green-600 uppercase">
                              Active
                            </span>
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Data not found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
