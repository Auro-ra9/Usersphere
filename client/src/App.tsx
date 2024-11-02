import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";
import MainPage from "./pages/MainPage";
import UserHome from "./pages/UserHome";
import SignIn from "./pages/UserSignIn";
import SignUp from "./pages/UserSignUp";
import UserProfile from "./pages/UserProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<MainPage/>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<UserProfile />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
