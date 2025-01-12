import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold font-mono text-gray-700 mb-36">
        User Management Application
      </h1>
      <div className="flex flex-col">
        <Link
          to="/sign-in"
          className="px-6 py-4 m-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-60 text-center"
        >
          Click here to log in as User
        </Link>
        <Link
          to="/admin/login"
          className="px-6 py-1 m-4 bg-green-500 text-white rounded-lg hover:bg-green-600 w-60 text-center"
        >
          Click here to log in as Admin
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
