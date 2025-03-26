import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const ForgetPasswordPage = () => {
  const { token } = useParams(); // Get token from URL
  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onEmailSubmit = async (data) => {
    try {
      const response = await axios.post("/forget-password", { email: data.email });
      setServerMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const response = await axios.post(`/reset-password/${token}`, { password: data.password });
      setServerMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          {token ? "Reset Password" : "Forgot Password"}
        </h2>

        {serverMessage ? (
          <p className="text-green-600 text-center">{serverMessage}</p>
        ) : (
          <form
            onSubmit={handleSubmit(token ? onPasswordSubmit : onEmailSubmit)}
            className="space-y-4"
          >
            {token ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-blue-200 focus:border-blue-500"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-blue-200 focus:border-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-blue-200 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            )}
          </form>
        )}

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
