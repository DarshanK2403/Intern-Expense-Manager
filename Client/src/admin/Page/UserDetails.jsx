/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const UserDetails = () => {
  const userId = localStorage.getItem("id");
  const [datas, setData] = useState([]);
  const [sortColumn, setSortcolumn] = useState(null);
  const [sortOrder, setSortorder] = useState("asc");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const getUserDetails = await axios.get("/admin/user-details");
        setData(getUserDetails.data);
        console.log(getUserDetails.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  return (
    <div>
      <TableContainer component={Paper} className="m-4">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Total Expenses</TableCell>
          </TableHead>
          <TableBody>
            {datas.length > 0 ? (
              datas.map((data) => (
                <TableRow key={data._id}>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>{data.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>{data.role.name}</TableCell>
                  <TableCell>{data.totalExpenses}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>Data not found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserDetails;
