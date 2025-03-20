/* eslint-disable no-unused-vars */
import axios from "axios";
import { Bell, Moon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userdata, setUserData] = useState("");
  const userId = localStorage.getItem("id");
  const [categorys, setCategorys] = useState([]);

  const {setValue } = useForm();
  useEffect(() => {
    const getUserdata = async () => {
      try {
        const res = await axios.get(`/userdata/${userId}`);
        setUserData(res.data);

        // Set form values dynamically
        for (const key in res.data) {
          setValue(key, res.data[key] || ""); // Ensure controlled inputs
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getCategory = async () => {
      try {
        const res = await axios.get(`/get-category/${userId}`);
        setCategorys(res.data.data);
        // console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getUserdata();
      getCategory();
    }
  }, [userId, setValue]);
  return (
    <div className="space-y-6 m-5 w-[70%] mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <span className="text-blue-600 font-medium text-xl">JD</span>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {userdata.firstName} {userdata.lastName}
            </h3>
            <p className="text-gray-500">{userdata.email}</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              Change Profile Picture
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={userdata.firstName}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete={userdata.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={userdata.email}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={userdata.lastName}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  autoComplete={userdata.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue={userdata.phone}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Preferences
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm text-gray-700">
                  Email Notifications
                </span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notifications"
                  className="sr-only"
                  defaultChecked
                />
                <div className="block bg-blue-600 rounded-full h-6 w-10"></div>
                <div className="dot absolute left-5 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm text-gray-700">Dark Mode</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="dark-mode" className="sr-only" />
                <div className="block bg-gray-200 rounded-full h-6 w-10"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
