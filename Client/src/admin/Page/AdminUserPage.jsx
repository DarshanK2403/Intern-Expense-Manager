/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminUserPage = () => {
  const [totalUser, setTotaluser] = useState(null);
  const [totalExpense, setTotalexpense] = useState(null);
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

    const getTotalExpenseCount = async () => {
      try {
        if(id){
          const res = await axios.get("admin/expense-details")
          // console.log("Total Expense Count", res.data.length)
          setTotalexpense(res.data.length)
        }else{
          toast.error("Not Found Expense");
        }
      } catch (error) {
        toast.error("Internal Server error");
      }
    };
    getTotalExpenseCount()
  }, []);
  return (
    <div>
      {/* Totast Message Show */}
      <ToastContainer></ToastContainer>
      <div className="flex w-max gap-5 m-2">
        {/* Total User Count */}
        <div className="p-5 bg-blue-100 text-blue-700 border text-nowrap flex-col border-gray-200 flex flex-1">
          <Link to="detail" className="font-bold text-xl">
            Total Users :
          </Link>
          <span>{totalUser}</span>
        </div>


        {/* Total Expense Count */}
        <div className="p-5 bg-blue-100 text-blue-700 border text-nowrap flex-col border-gray-200 flex flex-1">
          <span className="font-bold text-xl">Total Vouchers:</span>
          <span>{totalExpense}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
