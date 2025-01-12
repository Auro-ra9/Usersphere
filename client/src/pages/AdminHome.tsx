// AdminHome.tsx
import React, { useEffect, useState } from "react";
import { AdminNavbar } from "../components/AdminNavbar";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  appendUser,
  deleteUser,
  updateUser,
} from "../features/admin/manageUserSlice";
import { RootState } from "../app/store";

const AdminHome = () => {
  const usersList = useSelector((state: RootState) => state.admin.users);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signUpDetails, setSignUpDetails] = useState({
    username: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      const response = await axiosInstance.post("/api/admin/get-users");
      if (response.data) {
        dispatch(addUser(response.data.users));
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.post("/api/admin/delete-user", {
        id,
      });
      if (response.data) {
        toast.success(response.data.message);
        dispatch(deleteUser(id));
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleEdit = (user: { id: string; name: string; email: string }) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsModalOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const response = await axiosInstance.post("/api/admin/edit-user", {
          id: selectedUser.id,
          name,
          email,
        });
        if (response.data) {
          toast.success(response.data.message);
          dispatch(updateUser({ id: selectedUser.id, name, email }));
          setIsModalOpen(false);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to update user. Please try again.");
      }
    }
  };

  const handleUserSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !signUpDetails.username ||
      !signUpDetails.password ||
      !signUpDetails.email
    ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/api/admin/add-user",
        signUpDetails
      );
      if (response.data) {
        toast.success(response.data.message);
        // Optionally reset form fields
        setSignUpDetails({ username: "", password: "", email: "" });
        setIsAddUserModalOpen(false);
        dispatch(appendUser(response.data.user));
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col mt-10 items-center min-h-screen bg-gray-50">
        <h2 className="text-4xl font-semibold text-gray-900 mb-6">
          User Details
        </h2>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="mb-4 text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 transition"
        >
          Add User
        </button>
        <div className="container mx-auto w-full px-4">
          <table className="min-w-full text-sm text-left text-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead className="text-xs uppercase bg-gray-200 text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sl
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, index) => (
                <tr
                  className="bg-white border-b hover:bg-gray-100"
                  key={user.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      type="button"
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Edit User</h2>
              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 text-gray-700 border border-gray-300 rounded-md px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Add User</h2>
              <form onSubmit={handleUserSignUp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={signUpDetails.username}
                    onChange={(e) =>
                      setSignUpDetails({
                        ...signUpDetails,
                        username: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signUpDetails.email}
                    onChange={(e) =>
                      setSignUpDetails({
                        ...signUpDetails,
                        email: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signUpDetails.password}
                    onChange={(e) =>
                      setSignUpDetails({
                        ...signUpDetails,
                        password: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="mr-2 text-gray-700 border border-gray-300 rounded-md px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-green-600 hover:bg-green-700 rounded-md px-4 py-2"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
