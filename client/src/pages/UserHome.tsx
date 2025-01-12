import { Link } from "react-router-dom";
import { UserNavbar } from "../components/UserNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const UserHome = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <>
      <UserNavbar />
      <div
        className={`flex flex-col items-center justify-center min-h-screen${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-md mb-6">
          This is your personal space where you can manage your account
          settings, view your activity, and access all features available to
          you. Enjoy your stay!
        </p>
        <Link
          to="/profile"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Go to Profile
        </Link>
      </div>
    </>
  );
};

export default UserHome;
