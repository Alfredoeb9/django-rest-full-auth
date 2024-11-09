import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordData = {
      password: newPassword.password,
      confirmPassword: newPassword.confirmPassword,
      token: token,
      uid: uid,
    };
    // Add the logic to send the data to the server
    const response = await axiosInstance.post(
      "/auth/reset-password/",
      passwordData
    );

    if (!response) {
      console.log("Error");
      return;
    }

    const data = await response.data;

    setNewPassword({
      password: "",
      confirmPassword: "",
    });

    navigate("/login");
    return data;
  };

  return (
    <div>
      <div className="form-container">
        <div className="wrapper">
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="email-form"
                type="password"
                id="password"
                name="password"
                value={newPassword.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="email-form"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={newPassword.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
