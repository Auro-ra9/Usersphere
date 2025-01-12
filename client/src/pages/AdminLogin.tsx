import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
const AdminLogin = () => {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!loginDetails.username || !loginDetails.password) {
        toast.error("Both fields are required");
        return;
      }

      let response = await axiosInstance.post("/api/admin/login", loginDetails);

      if (response.data) {
        toast.success(response.data.message);
        navigate("/admin/home");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleAdminLogin}
        className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            value={loginDetails.username}
            onChange={(e) =>
              setLoginDetails({ ...loginDetails, username: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={loginDetails.password}
            onChange={(e) =>
              setLoginDetails({ ...loginDetails, password: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-200"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
