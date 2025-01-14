import { Link } from "react-router-dom";
import { UserNavbar } from "../components/UserNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const UserHome = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <div
        className={`flex-grow flex flex-col items-center justify-center p-4 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-600 border-gray-700"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-4 text-center md:text-5xl ${
            theme === "light" ? "text-gray-800" : "text-black"
          }`}
        >
          Welcome to Your Dashboard!
        </h1>
        <p
          className={`text-lg text-center max-w-md mb-6 md:text-xl ${
            theme === "light" ? "text-gray-600" : "text-white"
          }`}
        >
          This is your personal space where you can manage your account
          settings, view your activity, and access all features available to
          you. Enjoy your stay!
        </p>
        <Link
          to="/profile"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
};

export default UserHome;
