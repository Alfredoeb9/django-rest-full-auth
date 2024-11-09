import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "");
  const jwt_access = localStorage.getItem("jwt_access");

  useEffect(() => {
    if (!jwt_access || jwt_access === "" || !user) {
      navigate("/login");
    }
  }, [jwt_access, user]);

  const handleLogout = async () => {
    const refreshToken = JSON.parse(localStorage.getItem("refresh") || "");

    const response = await axiosInstance.post("auth/logout/", {
      refresh_token: refreshToken,
    });

    if (!response.data) {
      alert("An error occurred. Please try again later.");
      return;
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>hi {user && user.full_name}</h1>

      <p>Welcom to your profile</p>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
