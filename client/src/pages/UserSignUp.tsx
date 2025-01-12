import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../lib/axios";
import { UserNavbar } from "../components/UserNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
// import { useDispatch } from "react-redux";
// import { addUser, setError, setLoading } from "../features/admin/manageUserSlice";

const UserSignUp = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    username: "",
    password: "",
    email: "",
  });

  // const dispatch= useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.mode);
  // Handle user sign-up
  const handleUserSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      // dispatch(setLoading(true));
      if (
        signUpDetails.email.trim() === "" ||
        signUpDetails.username.trim() === "" ||
        signUpDetails.password.trim() === ""
      ) {
        toast.error("All field are required");
        return;
      }
      //call the backend route using axios
      let response = await axiosInstance.post("/api/signup", signUpDetails);

      //if we get success from the backend
      // inside try only success message comes using axios
      if (response.data) {
        toast.success(response.data.message);
        navigate("/login");

        // dispatch(addUser(signUpDetails));
      } else {
        toast.error("this is a failed response", response.data.message);
      }
    } catch (error: any) {
      //here only failed message comes from the backend in axios
      console.log(error);
      toast.error(error.message);
      // dispatch(setError('Error on user loading'))
    } finally {
      // dispatch(setLoading(false));
    }
  };

  return (
    <>
      <UserNavbar />
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
          <form
            onSubmit={handleUserSignUp}
            className="w-full max-w-sm p-8 bg-white"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                name
              </label>
              <input
                type="text"
                placeholder="enter your name"
                value={signUpDetails.username}
                onChange={(e) =>
                  setSignUpDetails({
                    ...signUpDetails,
                    username: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="enter your password"
                value={signUpDetails.password}
                onChange={(e) =>
                  setSignUpDetails({
                    ...signUpDetails,
                    password: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="enter email"
                value={signUpDetails.email}
                onChange={(e) =>
                  setSignUpDetails({ ...signUpDetails, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <button
            onClick={() => navigate("/sign-in")}
            className="text-blue-500 mt-4 underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSignUp;
