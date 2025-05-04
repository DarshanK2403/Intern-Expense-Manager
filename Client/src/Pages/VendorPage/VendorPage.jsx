import axios from "axios";
import { Edit, FileText, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { format } from "date-fns";

const VendorPage = () => {
  const token = localStorage.getItem("Token");
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const navigate = useNavigate();
  const { searchValue } = useOutletContext();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // default 5 per page
  const [selected, setSelected] = useState([]);

  // Fetch Vendor Data
  const getVendor = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/get-vendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendorData(res.data);
    } catch {
      toast.error("Failed to fetch vendor data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getVendor();
  }, [getVendor, searchValue]);

  // Delete Vendor
  const deleteVendors = async (ids) => {
    setLoading(true);
    try {
      await axios.delete("/delete-vendors", {
        data: { ids: Array.isArray(ids) ? ids : [ids] }, // 👈 Always send array
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Vendor(s) Deleted");
      setSelected([]);
      getVendor(); // refresh list
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

  const getComparator = (order, orderBy) => {
    return (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Fix: Convert incomeDate string to Date object for correct comparison
      // if (orderBy === "createdAt") {
      //   aValue = new Date(aValue);
      //   bValue = new Date(bValue);
      // }

      if (aValue === undefined || bValue === undefined) return 0;

      if (order === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    };
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...vendorData].sort(getComparator(order, orderBy));
  const lowerSearch = searchValue.toLowerCase();
  const filteredExpenses = vendorData.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerSearch) ||
      item.email.toLowerCase().includes(lowerSearch) ||
      item.createdAt.toLowerCase().includes(lowerSearch) ||
      item.category.category_name.toLowerCase().includes(lowerSearch)
  );

  const sortedFilteredExpenses = filteredExpenses.sort(
    getComparator(order, orderBy)
  );

  const visibleRows = sortedFilteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editVendor = async (id) => {
    try {
      navigate(`/vendor/edit/${id}`);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const detailVendor = async (id) => {
    try {
      const res = await axios.get(`/get-vendor-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/vendor/detail/${id}`, { state: res.data });
    } catch {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden mb-5">
      <ToastContainer></ToastContainer>

      {selected.length > 0 && (
        <button
          onClick={() => deleteVendors(selected)}
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
                      checked={selected.length === vendorData.length}
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < vendorData.length
                      }
                    />
                  </TableCell>
                  {["name", "email", "category", "createdAt", "Action"].map(
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
                      <TableCell>
                        <div
                          className="grid grid-rows-2 hover:cursor-pointer"
                          onClick={() => detailVendor(item._id)}
                        >
                          {item.name}
                          <span className="text-gray-600">{item.notes}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">{item.email}</div>
                      </TableCell>
                      <TableCell>
                        {item.category?.category_name ?? "-"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item?.createdAt), "dd MMM yyyy")}
                      </TableCell>
                      {/* Action */}
                      <TableCell>
                        <div className="flex gap-2">
                          <button onClick={() => editVendor(item._id)}>
                            <Edit
                              size={16}
                              className="text-gray-600 hover:text-blue-600"
                            />
                          </button>
                          <button onClick={() => deleteVendors(item._id)}>
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

export default VendorPage;
