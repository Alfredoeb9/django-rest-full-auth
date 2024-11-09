import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./components/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={"/"} element={<Signup />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/dashboard"} element={<Profile />} />
          <Route path={"/otp/verify"} element={<VerifyEmail />} />
          <Route path={"/forgot_password"} element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
