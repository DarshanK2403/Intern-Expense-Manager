/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Edit,
  FileText,
  IndianRupee,
  Tag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
} from "@mui/material";

const IncomePage = () => {
  const token = localStorage.getItem("Token");
  const [incomeData, setIncomeData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const { searchValue } = useOutletContext();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // default 5 per page

  useEffect(() => {
    if (token) {
      getIncome();
    }
  }, [token, searchValue]);

  // Get Income
  const getIncome = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/get-income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomeData(res.data);
      // console.log(res.data);
    } catch (error) {
      toast.error("Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/delete-income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Income Deleted");
      getIncome();
    } catch (error) {
      toast.error("Failed to delete income");
    }
  };

  const editIncome = async (id) => {
    navigate(`/income/edit-income/${id}`);
  };

  const getComparator = (order, orderBy) => {
    return (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Fix: Convert incomeDate string to Date object for correct comparison
      if (orderBy === "incomeDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue === undefined || bValue === undefined) return 0;

      if (order === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    };
  };

  // Handle Delete
  const handleDelete = () => {
    // Call your deleteExpense function here
    deleteIncome(selected);
    setSelected([]); // Clear selection after deletion
  };

  // Handle Selct All Click
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(sortedData.map((n) => n._id)); // Select all rows
    } else {
      setSelected([]); // Deselect all
    }
  };

  // Handle Checkbox Click
  const handleCheckboxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("incomeDate");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...incomeData].sort(getComparator(order, orderBy));

  const lowerSearch = searchValue.toLowerCase();

// Later in your code, where the error occurs:
const filteredIncomes = Array.isArray(incomeData) 
  ? incomeData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerSearch) ||
        item.category.category_name.toLowerCase().includes(lowerSearch) ||
        item.amount.toString().includes(lowerSearch)
    )
  : [];
  // Apply sort to the filtered results
  const sortedFilteredExpenses = filteredIncomes.sort(
    getComparator(order, orderBy)
  );

  const visibleRows = sortedFilteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <ToastContainer autoClose={1500}></ToastContainer>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden mb-5 ">
        {selected.length > 0 && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
          >
            Delete Income
          </button>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : visibleRows.length > 0 ? (
          <>
            {/* Table */}
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={handleSelectAllClick}
                          checked={selected.length === incomeData.length}
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < incomeData.length
                          }
                        />
                      </TableCell>
                      {[
                        "title",
                        "amount",
                        "category",
                        "incomeDate",
                        "Action",
                      ].map((headCell) => (
                        <TableCell
                          key={headCell}
                          sortDirection={orderBy === headCell ? order : false}
                        >
                          <TableSortLabel
                            active={orderBy === headCell}
                            direction={orderBy === headCell ? order : "asc"}
                            onClick={() => handleSort(headCell)}
                          >
                            {headCell.charAt(0).toUpperCase() +
                              headCell.slice(1)}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((item) => {
                      const isSelected = selected.indexOf(item._id) !== -1;
                      return (
                        <TableRow key={item._id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onClick={(event) =>
                                handleCheckboxClick(event, item._id)
                              }
                              role="checkbox"
                              aria-checked={isSelected}
                              selected={isSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="grid grid-rows-2">
                              {item.title}
                              <span className="text-gray-600">
                                {item.notes}  
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${item.amount}</TableCell>
                          <TableCell>{item.category.category_name}</TableCell>
                          <TableCell>
                            {format(new Date(item.incomeDate), "dd MMM, yyyy")}
                          </TableCell>
                          {/* Action */}
                          <TableCell>
                            <div className="flex gap-2">
                              <button onClick={() => editIncome(item._id)}>
                                <Edit
                                  size={16}
                                  className="text-gray-600 hover:text-blue-600"
                                />
                              </button>
                              <button onClick={() => deleteIncome(item._id)}>
                                <Trash2
                                  size={16}
                                  className="text-gray-600 hover:text-red-600"
                                />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 25, 50]}
                component="div"
                count={filteredIncomes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Income Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven&#39;t recorded any income transactions. Start by adding
              an income.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomePage;
