import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/admin/manageUserSlice";
import { onLogin } from "../features/user/userSlice";
import { UserNavbar } from "../components/UserNavbar";

const UserSignIn = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    password: "",
    email: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle user sign-up
  const handleUserSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      dispatch(setLoading(true));
      if (
        signUpDetails.email.trim() === "" ||
        signUpDetails.password.trim() === ""
      ) {
        toast.error("Invalid login details");
        return;
      }

      //call the backend route using axios for checking user existence
      let response = await axiosInstance.post("/api/login", signUpDetails);

      //if we get success from the backend
      // inside try only success message comes using axios
      if (response.data.success) {
        toast.success(response.data.message);
        let user: string = response.data.user.name;
        dispatch(
          onLogin({ email: signUpDetails.email, name: user, isLogin: true })
        );

        navigate("/home");
      } else {
        toast.error("this is a failed response", response.data.message);
      }
    } catch (error: any) {
      //here only failed message comes from the backend in axios
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
          <form
            onSubmit={handleUserSignIn}
            className="w-full max-w-sm p-8 bg-white"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

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

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={() => navigate("/sign-up")}
            className="text-blue-500 mt-4 underline"
          >
            Do not have an account? Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSignIn;
