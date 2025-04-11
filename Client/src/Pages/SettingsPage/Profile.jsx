/* eslint-disable no-unused-vars */
import axios from "axios";
import { Link } from "react-router-dom";
import { Bell, Moon, Lock, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Used for route change warning
import { Input } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const token = localStorage.getItem("Token");
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const watchedValues = watch();
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState();
  useEffect(() => {
    const getUserdata = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(token)
        setInitialData(res.data);
        reset(res.data);
        setProfileImg(res.data.img);
      } catch (error) {
        toast.error("User data not found");
      }
      setLoading(false);
    };

    if (token) getUserdata();
  }, [token, reset]);

  // Function to compare initial data with current form data
  const hasChanges = useCallback(() => {
    return JSON.stringify(initialData) !== JSON.stringify(watchedValues);
  }, [initialData, watchedValues]);

  const enableEditing = () => setIsEditing(true);

  const disableEditing = () => {
    if (hasChanges()) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Discard them?"
      );
      if (!confirmDiscard) return;
    }
    setIsEditing(false);
    reset(initialData);
  };

  // Prevent closing tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges()) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  // Prevent navigating away if there are unsaved changes
  useEffect(() => {
    const handleRouteChange = (event) => {
      if (hasChanges()) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!confirmLeave) event.preventDefault();
      }
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [hasChanges]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.put(`/update-profile`,data  ,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setInitialData(data);
      setIsEditing(false);
      setLoading(false);
      toast.success("Profile Picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get selected file
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImg", file);

    try {
      const res = await axios.put(
        `/change-profile-picture`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        },
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Profile updated:", res.data);
      setProfileImg(res.data.user.profileImg); // Update UI with new image
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
    setLoading(false);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 m-5 w-[70%] mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center mr-4">
              <span className="text-blue-600 font-medium text-xl">
                {initialData.img ? (
                  <img src={profileImg} />
                ) : (
                  <img src="/logo.png" />
                )}{" "}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {initialData.firstName} {initialData.lastName}
              </h3>
              <p className="text-gray-500">{initialData.email}</p>
              <button
                type="button"
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={handleButtonClick}
                disabled={loading} // Disable while uploading
              >
                {loading ? "Uploading..." : "Change Profile Picture"}
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("firstName")}
                    disabled={!isEditing}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    {...register("email")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("lastName")}
                    disabled={!isEditing}
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("phone")}
                    disabled={!isEditing}
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
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">Dark Mode</span>
                </div>
                <input type="checkbox" className="toggle-checkbox" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <Link
              to="change-password"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Link>

            {!isEditing ? (
              <button
                onClick={enableEditing}
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={disableEditing}
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
