import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
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
import FormattedAmount from "../../Components/FormattedAmount";

const ExpensesPage = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  const [expenses, setExpenses] = useState([]);
  const { searchValue } = useOutletContext();
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("expenseDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const getExpense = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios(`/get-expense/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data.data);
    } catch {
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getExpense();
    }
  }, [token, searchValue, getExpense]);

  const expenseDetail = async (id) => {
    try {
      navigate(`expense-detail/${id}`);
    } catch {
      toast.error("Somthing went wrong!");
    }
  };

  const editExpense = async (id) => {
    try {
      navigate(`edit-expense/${id}`);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // Delete Expense
  const deleteExpenses = async (ids) => {
    setLoading(true);
    try {
      await axios.delete("/delete-expense", {
        data: { ids: Array.isArray(ids) ? ids : [ids] },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Expense(s) Deleted");
      setSelected([]);
      getExpense();
    } catch {
      toast.error("Failed to delete vendor(s)");
    } finally {
      setLoading(false);
    }
  };

  // Handle Selct All Click
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(sortedData.map((n) => n._id));
    } else {
      setSelected([]);
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

  // Sorting table
  const getComparator = (order, orderBy) => {
    return (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === "expenseDate") {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Hanlde Sort
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sorted Data
  const sortedData = [...expenses].sort(getComparator(order, orderBy));
  const lowerSearch = searchValue.toLowerCase();
  const filteredExpenses = expenses.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerSearch) ||
      item.category?.category_name.toLowerCase().includes(lowerSearch) ||
      item.amount.toString().includes(lowerSearch)
  );

  const sortedFilteredExpenses = filteredExpenses.sort(
    getComparator(order, orderBy)
  );

  const visibleRows = sortedFilteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden mb-5 ">
      <ToastContainer autoClose={1500}></ToastContainer>
      {selected.length > 0 && (
        <button
          onClick={() => deleteExpenses(selected)}
          className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
        >
          Delete Expense
        </button>
      )}
      {/* Expenses List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <SpinnerLoader size="large" color="blue" />
        </div>
      ) : visibleRows.length > 0 ? (
        // Table
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      onChange={handleSelectAllClick}
                      checked={selected.length === expenses.length}
                      indeterminate={
                        selected.length > 0 && selected.length < expenses.length
                      }
                    />
                  </TableCell>
                  {["title", "amount", "category", "expenseDate", "Action"].map(
                    (headCell) => (
                      <TableCell
                        key={headCell}
                        sortDirection={orderBy === headCell ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell}
                          direction={orderBy === headCell ? order : "asc"}
                          onClick={() => handleSort(headCell)}
                        >
                          {headCell.charAt(0).toUpperCase() + headCell.slice(1)}
                        </TableSortLabel>
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((item) => {
                  const isSelected = selected.indexOf(item._id) !== -1;
                  return (
                    <TableRow key={item._id} hover>
                      <TableCell
                        padding="checkbox"
                        onClick={(event) =>
                          handleCheckboxClick(event, item._id)
                        }
                        role="checkbox"
                        aria-checked={isSelected}
                        selected={isSelected}
                      >
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell onClick={() => expenseDetail(item._id)}>
                        <div className="grid hover:cursor-pointer">
                          {item.title}
                          <span className="text-gray-600">
                            {item.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FormattedAmount amount={item.amount} />
                        </div>
                      </TableCell>
                      <TableCell>{item.category?.category_name}</TableCell>
                      <TableCell>
                        {format(new Date(item.expenseDate), "dd MMM yyyy")}
                      </TableCell>
                      {/* Action */}
                      <TableCell>
                        <div className="flex gap-2">
                          <button onClick={() => editExpense(item._id)}>
                            <Edit
                              size={16}
                              className="text-gray-600 hover:text-blue-600"
                            />
                          </button>
                          <button onClick={() => deleteExpenses(item._id)}>
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
            count={filteredExpenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Expense Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md font-sans min-h-[40px]">
            You haven&#39;t recorded any expense transactions. Start by adding
            an expense.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
